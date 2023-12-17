import { dbClient } from '@ftoggle/db/connection';
import { features } from '@ftoggle/db/schema';
import { eq } from 'drizzle-orm';

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
