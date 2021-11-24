/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { parse } from 'path';
import { CfnResource, Stack } from 'aws-cdk-lib';
import { CfnCluster } from 'aws-cdk-lib/aws-msk';
import { NagRuleCompliance, resolveIfPrimitive } from '../../nag-pack';

/**
 * MSK clusters use TLS communication between brokers
 * @param node the CfnResource to check
 */
export default Object.defineProperty(
  (node: CfnResource): NagRuleCompliance => {
    if (node instanceof CfnCluster) {
      const encryptionInfo = Stack.of(node).resolve(node.encryptionInfo);
      if (encryptionInfo != undefined) {
        const encryptionInTransit = Stack.of(node).resolve(
          encryptionInfo.encryptionInTransit
        );
        if (encryptionInTransit != undefined) {
          const inCluster = resolveIfPrimitive(
            node,
            encryptionInTransit.inCluster
          );
          if (inCluster === false) {
            return NagRuleCompliance.NON_COMPLIANT;
          }
        }
      }
      return NagRuleCompliance.COMPLIANT;
    } else {
      return NagRuleCompliance.NOT_APPLICABLE;
    }
  },
  'name',
  { value: parse(__filename).name }
);
