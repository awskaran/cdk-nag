/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { parse } from 'path';
import { CfnResource } from 'aws-cdk-lib';
import { CfnDBCluster } from 'aws-cdk-lib/aws-docdb';
import { NagRuleCompliance, resolveIfPrimitive } from '../../nag-pack';

/**
 * Document DB clusters have encryption at rest enabled
 * @param node the CfnResource to check
 */
export default Object.defineProperty(
  (node: CfnResource): NagRuleCompliance => {
    if (node instanceof CfnDBCluster) {
      if (node.storageEncrypted == undefined) {
        return NagRuleCompliance.NON_COMPLIANT;
      }
      const storageEncrypted = resolveIfPrimitive(node, node.storageEncrypted);
      if (!storageEncrypted) {
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
