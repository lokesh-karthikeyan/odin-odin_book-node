import * as service from './users.service.js';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

async function getAllUsersNotConnectedWithProfileHandler(request, reply) {
  const currentUserId = request.user.id;
  const users = await service.getAllUsersNotConnectedWithProfileService(request.server, currentUserId);
  const data = { users }
  return reply.success(data);
}

async function getUserProfileHandler(request, reply) {
  const { id } = request.params;
  const profile = await service.getUserProfileService(request.server, id, request.user.id);
  request.log.info(profile)
  const data = { profile };
  return reply.success(data);
}

async function getFollowersHandler(request, reply) {
  const { id } = request.params;
  const followers = await service.getFollowersService(request.server, id);
  const data = { followers };
  return reply.success(data);
}

async function getFollowingHandler(request, reply) {
  const { id } = request.params;
  const following = await service.getFollowingService(request.server, id);
  const data = { following };
  return reply.success(data);
}

async function updateProfileHandler(request, reply) {
  const userId = request.user.id;

  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  let fullName = null;
  let bio = '';
  let picturePath = null;

  for await (const part of request.parts()) {
    if (part.type === 'file') {
      if (!part.filename) continue;

      const fileName = `${Date.now()}-${part.filename}`;
      const filePath = path.join(uploadDir, fileName);

      await pipeline(part.file, fs.createWriteStream(filePath));

      picturePath = `/uploads/${fileName}`;
    }

    if (part.type === 'field') {
      if (part.fieldname === 'fullName') fullName = part.value;
      if (part.fieldname === 'bio') bio = part.value;
    }
  }

  if (!fullName || fullName.length < 2 || fullName.length > 100) {
    return reply.code(400).send({
      message: 'Full name must be between 2 and 100 characters'
    });
  }

  if (bio && bio.length > 500) {
    return reply.code(400).send({
      message: 'Bio cannot exceed 500 characters'
    });
  }

  const updated = await service.updateProfileService(
    request.server,
    userId,
    {
      fullName,
      bio,
      picture: picturePath
    }
  );

  return reply.success({ updated });
}

export {
  getAllUsersNotConnectedWithProfileHandler,
  getUserProfileHandler,
  getFollowersHandler,
  getFollowingHandler,
  updateProfileHandler,
};

