/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { parse } from 'path';
import { CfnResource, Stack } from 'aws-cdk-lib';
import { CfnStateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { NagRuleCompliance, resolveIfPrimitive } from '../../nag-pack';

/**
 * Step Function have X-Ray tracing enabled
 * @param node the CfnResource to check
 */
export default Object.defineProperty(
  (node: CfnResource): NagRuleCompliance => {
    if (node instanceof CfnStateMachine) {
      const tracingConfiguration = Stack.of(node).resolve(
        node.tracingConfiguration
      );
      if (tracingConfiguration == undefined) {
        return NagRuleCompliance.NON_COMPLIANT;
      }
      const enabled = resolveIfPrimitive(node, tracingConfiguration.enabled);
      if (!enabled) {
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
