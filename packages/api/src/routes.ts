import Elysia from 'elysia';
import { apiTokenHandlers } from './handlers/apiTokenHandlers';
import { apiTokensHandlers } from './handlers/apiTokensHandlers';
import {
  changePasswordHandler,
  loginHandler,
  logoutHandler,
  signupHandler,
} from './handlers/authHandlers';
import { clientFeaturesHandler } from './handlers/clientFeaturesHandlers';
import { conditionHandlers } from './handlers/conditionHandlers';
import { conditionsHandlers } from './handlers/conditionsHandlers';
import { contextFieldHandlers } from './handlers/contextFieldHandlers';
import { contextFieldsHandlers } from './handlers/contextFieldsHandlers';
import { environmentHandlers } from './handlers/environementHandlers';
import { environmentsHandlers } from './handlers/environementsHandlers';
import { featureEnvironmentHandler } from './handlers/featureEnvironmentHandlers';
import { featureHandlers } from './handlers/featureHandlers';
import { featuresHandlers } from './handlers/featuresHandlers';
import { githubLoginHandler } from './handlers/githubLoginHandlers';
import { projectHandlers } from './handlers/projectHandlers';
import { projectsHandlers } from './handlers/projectsHandlers';
import { userHandlers } from './handlers/userHandlers';
import { userRoleHandlers } from './handlers/userRoleHandlers';
import { userRolesHandlers } from './handlers/userRolesHandlers';
import { usersHandlers } from './handlers/usersHandlers';
import { usersRolesHandlers } from './handlers/usersRolesHandlers';

// prettier-ignore
export const routes = new Elysia()
  .group('/api', _ => _
    .group('/client', _ => _
      .group('/features', _ => _.use(clientFeaturesHandler)
      ) // /features
    ) // /client
    .group('/auth', _ => _
      .group('/login', _ => _.use(loginHandler)
        .group('/github', _ => _.use(githubLoginHandler)
        ) // /github
      ) // /login
      .group('/signup', _ => _.use(signupHandler))
      .group('/logout', _ => _.use(logoutHandler))
      .group('/change-password', _ => _.use(changePasswordHandler))
    ) // /auth
    .group('/projects', _ => _.use(projectsHandlers)
      .group('/:projectId', _ => _.use(projectHandlers)
        .group('/apiTokens', _ => _.use(apiTokensHandlers)
          .group('/:apiTokenId', _ => _.use(apiTokenHandlers)
          ) // /:apiTokenId
        ) // /apiTokens
        .group('/context-fields', _ => _.use(contextFieldsHandlers)
          .group('/:contextFieldName', _ => _.use(contextFieldHandlers)
          ) // /:contextFieldName
        ) // /context-fields
        .group('/environments', _ => _.use(environmentsHandlers)
          .group('/:environmentId', _ => _.use(environmentHandlers)
          ) // /:environmentId
        ) // /environments
        .group('/features', _ => _.use(featuresHandlers)
          .group('/:featureName', _ => _.use(featureHandlers)
            .group('/environments', _ => _
              .group('/:environmentId', _ => _.use(featureEnvironmentHandler)
                .group('/conditions', _ => _.use(conditionsHandlers)
                  .group('/:conditionId', _ => _.use(conditionHandlers)
                  ) // /:conditionId
                ) // /conditions
              ) // /:environmentId
            ) // /environments
          ) // /:featureName
        ) // /features
      ) // /:projectId
    ) // /projects
    .group('/users', _ => _.use(usersHandlers)
      .group('/roles', _ => _.use(usersRolesHandlers)
      ) // /roles
      .group('/:userId', _ => _.use(userHandlers)
        .group('/roles', _ => _.use(userRolesHandlers)
          .group('/:roleId', _ => _.use(userRoleHandlers)
          ) // /:roleId
        ) // /roles
      ) // /:userId
    ) // /users
  ) // /api
;
