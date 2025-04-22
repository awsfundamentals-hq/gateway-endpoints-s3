// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'awsf-oss-gw-endpoints',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
      providers: {
        aws: {
          region: 'us-east-1',
          version: '6.73.0',
        },
      },
    };
  },
  async run() {
    // creating a VPC
    // this will by default also create private & public subnets
    // for all 3 AZs in us-east-1
    const { privateSubnets, id: vpcId } = new sst.aws.Vpc('awsf-vpc', {
      az: 3,
    });

    const blockAll = new aws.ec2.SecurityGroup('block_all', {
      name: 'block_all',
      description: 'Block all inbound but allow outbound HTTPS traffic',
      vpcId,
      egress: [
        {
          fromPort: 443,
          toPort: 443,
          protocol: 'tcp',
          cidrBlocks: ['0.0.0.0/0'],
        },
      ],
      tags: {
        Name: 'allow_tls',
      },
    });

    new sst.aws.Function('awsf-function', {
      handler: 'functions/function.handler',
      timeout: '15 seconds',
      memory: '1024 MB',
      vpc: {
        privateSubnets,
        securityGroups: [blockAll.id],
      },
    });

    new sst.aws.Nextjs('frontend', {
      environment: {},
    });
  },
});
