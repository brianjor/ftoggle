import { dbClient } from '@ftoggle/db/connection';
import { conditions, projectsFeaturesEnvironments } from '@ftoggle/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

export class ClientController {
  async getFeatures(projectId: string, environmentId: string) {
    // Get features
    const features = await dbClient.query.projectsFeaturesEnvironments.findMany(
      {
        where: and(
          eq(projectsFeaturesEnvironments.projectId, projectId),
          eq(projectsFeaturesEnvironments.environmentId, environmentId),
        ),
        with: {
          feature: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    );
    const featureIds = features.map((f) => f.featureId);
    // Get conditions for the features
    const featureConditions = await dbClient.query.conditions.findMany({
      where: and(
        eq(conditions.projectId, projectId),
        eq(conditions.environmentId, environmentId),
        inArray(conditions.featureId, featureIds),
      ),
      columns: {
        featureId: true,
        operator: true,
        values: true,
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
      conditions: featureConditions
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
