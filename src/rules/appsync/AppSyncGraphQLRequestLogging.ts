/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { parse } from 'path';
import { CfnResource, Stack } from 'aws-cdk-lib';
import { CfnGraphQLApi } from 'aws-cdk-lib/aws-appsync';
import { NagRuleCompliance, resolveIfPrimitive } from '../../nag-pack';

/**
 * GraphQL APIs have request leveling logging enabled
 * @param node the CfnResource to check
 */
export default Object.defineProperty(
  (node: CfnResource): NagRuleCompliance => {
    if (node instanceof CfnGraphQLApi) {
      const logConfig = Stack.of(node).resolve(node.logConfig);
      if (logConfig === undefined) {
        return NagRuleCompliance.NON_COMPLIANT;
      }
      const excludeVerboseContent = resolveIfPrimitive(
        node,
        logConfig.excludeVerboseContent
      );
      if (
        logConfig.cloudWatchLogsRoleArn === undefined ||
        excludeVerboseContent === true
      ) {
        return NagRuleCompliance.NON_COMPLIANT;
      }
      return NagRuleCompliance.COMPLIANT;
    } else {
      return NagRuleCompliance.NOT_APPLICABLE;
    }
  },
  'name',
  { value: parse(__filename).name }
);
