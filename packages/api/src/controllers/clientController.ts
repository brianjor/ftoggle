import { dbClient } from '@ftoggle/db/connection';
import { projectsFeaturesEnvironments } from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';

export class ClientController {
  async getFeatures(projectId: string, environmentId: number) {
    return (
      await dbClient.query.projectsFeaturesEnvironments.findMany({
        where: and(
          eq(projectsFeaturesEnvironments.projectId, projectId),
          eq(projectsFeaturesEnvironments.environmentId, environmentId),
        ),
        with: {
          feature: {
            columns: {
              name: true,
            },
          },
        },
      })
    ).map((pfe) => ({
      name: pfe.feature.name,
      isEnabled: pfe.isEnabled,
    }));
  }
}
