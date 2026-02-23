import { Router } from 'express';

import type { TemplateController } from './template.controller';

import { container } from '@/app/di/container';
import { CONTROLLER_TOKENS } from '@/app/di/tokens/controller.tokens';
import { authMiddleware } from '@/app/middlewares/auth.middleware';

const router = Router();
const templateController = container.resolve<TemplateController>(
  CONTROLLER_TOKENS.TemplateController,
);

router.get('/', authMiddleware, templateController.getAllTemplates.bind(templateController));
router.post('/', authMiddleware, templateController.createNewTemplate.bind(templateController));
router.post(
  '/:id/finalize',
  authMiddleware,
  templateController.finalizeTemplate.bind(templateController),
);
router.post(
  '/:id/attachments/presign',
  authMiddleware,
  templateController.getPresignedUploadUrl.bind(templateController),
);
router.post(
  '/:id/attachments/complete',
  authMiddleware,
  templateController.reportAttachmentComplete.bind(templateController),
);
router.delete(
  '/:id/attachments/:key',
  authMiddleware,
  templateController.deleteAttachment.bind(templateController),
);
router.get('/:id', authMiddleware, templateController.getTemplateById.bind(templateController));
router.patch(
  '/:id',
  authMiddleware,
  templateController.updateExistingTemplateById.bind(templateController),
);
router.delete(
  '/:id',
  authMiddleware,
  templateController.deleteExistingTemplateById.bind(templateController),
);

export const templateRoutes: ReturnType<typeof Router> = router;
