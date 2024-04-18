import { dbClient } from '@ftoggle/db/connection';
import { tConditions, tProjectsFeaturesEnvironments } from '@ftoggle/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

export class ClientController {
  async getFeatures(projectId: string, environmentId: string) {
    // Get features
    const features =
      await dbClient.query.tProjectsFeaturesEnvironments.findMany({
        where: and(
          eq(tProjectsFeaturesEnvironments.projectId, projectId),
          eq(tProjectsFeaturesEnvironments.environmentId, environmentId),
        ),
        with: {
          feature: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });
    const featureIds = features.map((f) => f.featureId);
    // Get conditions for the features
    const conditions = await dbClient.query.tConditions.findMany({
      where: and(
        eq(tConditions.projectId, projectId),
        eq(tConditions.environmentId, environmentId),
        inArray(tConditions.featureId, featureIds),
      ),
      columns: {
        featureId: true,
        operator: true,
        values: true,
        value: true,
      },
      with: {
        contextField: {
          columns: {
            name: true,
          },
        },
      },
    });
    // Join features with their conditions
    const featuresWConditions = features.map((f) => ({
      name: f.feature.name,
      isEnabled: f.isEnabled,
      conditions: conditions
        .filter((c) => c.featureId === f.featureId)
        .map((c) => ({
          field: c.contextField.name,
          operator: c.operator,
          values: c.values,
        })),
    }));
    return featuresWConditions;
  }
}
