/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { parse } from 'path';
import { CfnResource } from 'aws-cdk-lib';
import { CfnDBInstance } from 'aws-cdk-lib/aws-rds';
import { NagRuleCompliance, resolveIfPrimitive } from '../../nag-pack';

/**
 * RDS DB instances have automatic minor version upgrades enabled
 * @param node the CfnResource to check
 */
export default Object.defineProperty(
  (node: CfnResource): NagRuleCompliance => {
    if (node instanceof CfnDBInstance) {
      const autoMinorVersionUpgrade = resolveIfPrimitive(
        node,
        node.autoMinorVersionUpgrade
      );
      if (autoMinorVersionUpgrade === false) {
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
