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
    const {
      publicSubnets,
      privateSubnets,
      id: vpcId,
    } = new sst.aws.Vpc('awsf-vpc', {
      az: 3,
    });

    const routeTableIds = privateSubnets.apply((subnets) =>
      subnets.map((subnet) =>
        subnet.apply((subnet) =>
          aws.ec2
            .getRouteTable({
              subnetId: subnet,
            })
            .then((rt) => rt.id)
        )
      )
    );

    const endpoint = new aws.ec2.VpcEndpoint('awsf-s3-endpoint', {
      vpcId,
      serviceName: 'com.amazonaws.us-east-1.s3',
      vpcEndpointType: 'Gateway',
      routeTableIds,
    });

    const bucket = new sst.aws.Bucket('awsf-bucket', {
      policy: [
        {
          effect: 'deny',
          actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
          principals: [
            {
              type: 'aws',
              identifiers: ['*'],
            },
          ],
          conditions: [
            {
              test: 'StringNotEquals',
              variable: 'aws:sourceVpce',
              values: [endpoint.id],
            },
          ],
        },
      ],
    });

    const blockAll = new aws.ec2.SecurityGroup('block_all', {
      name: 'block_all',
      description: 'Block all inbound and outbound traffic',
      vpcId,
      ingress: [],
      egress: [],
      tags: {
        Name: 'block_all',
      },
    });

    const allowAll = new aws.ec2.SecurityGroup('allow_all', {
      name: 'allow_all',
      description: 'Allow all inbound and outbound traffic',
      vpcId,
      ingress: [],
      egress: [],
      tags: {
        Name: 'allow_all',
      },
    });

    const privateFunction = new sst.aws.Function('awsf-function', {
      handler: 'functions/private.handler',
      timeout: '15 seconds',
      memory: '1024 MB',
      vpc: {
        privateSubnets,
        securityGroups: [blockAll.id],
      },
      environment: {
        BUCKET_NAME: bucket.name,
      },
    });

    const publicFunction = new sst.aws.Function('awsf-public-function', {
      handler: 'functions/public.handler',
      timeout: '15 seconds',
      memory: '1024 MB',
      link: [privateFunction],
      url: true,
      environment: {
        FUNCTION_NAME: privateFunction.name,
      },
    });

    new sst.aws.Nextjs('frontend', {
      environment: {
        API_URL: publicFunction.url,
      },
    });
  },
});
