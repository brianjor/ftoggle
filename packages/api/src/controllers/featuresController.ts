import { eq } from 'drizzle-orm';
import { dbClient } from '../db/connection';
import { features } from '../db/schema/features';

export class FeaturesController {
  public async addFeature(name: string) {
    return await dbClient.insert(features).values({ name });
  }

  public async getFeatures() {
    return await dbClient.select().from(features);
  }

  public async getFeature(id: number) {
    return await dbClient.select().from(features).where(eq(features.id, id));
  }
}
