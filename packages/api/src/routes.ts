import Elysia from 'elysia';
import {
  changePasswordHandler,
  loginHandler,
  logoutHandler,
  signupHandler,
} from './handlers/authHandlers';
import { featureHandlers } from './handlers/featureHandlers';
import { featuresHandlers } from './handlers/featuresHandlers';
import { projectHandlers } from './handlers/projectHandlers';
import { projectUserHandlers } from './handlers/projectUserHandlers';
import { projectUsersHandlers } from './handlers/projectUsersHandlers';
import { projectsHandlers } from './handlers/projectsHandlers';
import { userRolesHandlers } from './handlers/userRolesHandlers';

// prettier-ignore
export const routes = new Elysia()
  .group('/auth', _ => _
    .group('/login', _ => _.use(loginHandler))
    .group('/signup', _ => _.use(signupHandler))
    .group('/logout', _ => _.use(logoutHandler))
    .group('/change-password', _ => _.use(changePasswordHandler))
  ) // /auth
  .group('/projects', _ => _.use(projectsHandlers)
    .group('/:projectId', _ => _.use(projectHandlers)
      .group('/features', _ => _.use(featuresHandlers)
        .group('/:featureId', _ => _.use(featureHandlers)
        ) // /:featureId
      ) // /features
      .group('/users', _ => _.use(projectUsersHandlers)
        .group('/:userId', _ => _.use(projectUserHandlers)
        ) // /:userId
      ) // /users
    ) // /:projectId
  ) // /projects
  .group('/users', _ => _
    .group('/:userId', _ => _
      .group('/roles', _ => _.use(userRolesHandlers)
      ) // /roles
    ) // /:userId
  ) // /users
;
