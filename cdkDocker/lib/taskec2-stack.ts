import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import ecs_patterns = require('aws-cdk-lib/aws-ecs-patterns');
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Taskec2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getExistingVpc = ec2.Vpc.fromLookup(this, 'vpc', {
      vpcId: "vpc-0f83b9167ffd4fed8"
    });

    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: getExistingVpc
    });

    // Create Task Definition
    const loadBalancedFargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster,
      memoryLimitMiB: 1024,
      desiredCount: 1,
      cpu: 512,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("merketplaceallinone"),
      },
      loadBalancerName: 'merketplaceallinone-lb',
    });

    const executionRolePolicy =  new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ]
    });
    loadBalancedFargateService.taskDefinition.addToExecutionRolePolicy(executionRolePolicy);

    
    
    //addToExecutionRolePolicy(executionRolePolicy);
    /*loadBalancedFargateService.addToTaskRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [table.tableArn],
      actions: ['dynamodb:*']
    }));*/
  }
}
