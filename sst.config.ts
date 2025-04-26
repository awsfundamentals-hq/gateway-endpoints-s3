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
    const { privateSubnets, id: vpcId } = new sst.aws.Vpc('awsf-vpc', {
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
          actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject', 's3:ListBucket'],
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
      description: 'Security group for private Lambda function',
      vpcId,
      ingress: [],
      egress: [
        {
          fromPort: 443,
          toPort: 443,
          protocol: 'tcp',
          cidrBlocks: ['0.0.0.0/0'],
        },
      ],
      tags: {
        Name: 'block_all',
      },
    });

    new sst.aws.Function('awsf-function', {
      timeout: '5 seconds',
      handler: 'functions/private.handler',
      memory: '1024 MB',
      link: [bucket],
      vpc: {
        privateSubnets,
        securityGroups: [blockAll.id],
      },
      environment: {
        BUCKET_NAME: bucket.name,
      },
    });

    new sst.aws.Nextjs('frontend', {
      environment: {},
    });
  },
});
