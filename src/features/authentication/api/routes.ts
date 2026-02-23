import { Router } from 'express';

import { OAuthController } from './auth.controller';

import { container } from '@/app/di/container';
import { CONTROLLER_TOKENS } from '@/app/di/tokens/controller.tokens';
import { authMiddleware } from '@/app/middlewares/auth.middleware';

const router = Router();
const oauthController = container.resolve<OAuthController>(CONTROLLER_TOKENS.OAuthController);

router.get('/google', (req, res) => oauthController.initiateGoogleAuth(req, res));
router.get('/google/callback', (req, res, next) => {
  void oauthController.handleGoogleCallback(req, res).catch(next);
});
router.get('/me', authMiddleware, (req, res) => oauthController.me(req, res));
router.post('/logout', (req, res) => oauthController.logout(req, res));

export const authRoutes: ReturnType<typeof Router> = router;
