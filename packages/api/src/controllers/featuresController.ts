import { dbClient } from '@ftoggle/db/connection';
import { features } from '@ftoggle/db/schema';
import { eq } from 'drizzle-orm';

export class FeaturesController {
  public async addFeature(name: string, projectId: number) {
    return await dbClient.insert(features).values({ name, projectId });
  }

  public async getFeatures(projectId: number) {
    return await dbClient
      .select()
      .from(features)
      .where(eq(features.projectId, projectId));
  }

  public async getFeature(featureId: number) {
    return await dbClient
      .select()
      .from(features)
      .where(eq(features.id, featureId));
  }
}
