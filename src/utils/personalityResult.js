import {
  CONNECTION_TYPES,
  THINKING_TYPES,
  pickRandomPersonalityResult,
} from '../data/personalityTypes';
import { getStoredUser, updateStoredUser } from './userProfile';

/**
 * @param {import('../data/personalityTypes').PersonalityProfile} connection
 * @param {import('../data/personalityTypes').PersonalityProfile} thinking
 */
export function buildPersonalityResult(connection, thinking) {
  return {
    headline: `${connection.title} - ${thinking.title}`,
    connection: {
      label: '나의 연결 방식',
      ...connection,
    },
    thinking: {
      label: '나의 사고 방식',
      ...thinking,
    },
  };
}

/**
 * @param {string} headline
 */
export function resolvePersonalityResultFromHeadline(headline) {
  const [connectionTitle, thinkingTitle] = headline.split(' - ').map((part) => part.trim());
  const connection = CONNECTION_TYPES.find((item) => item.title === connectionTitle);
  const thinking = THINKING_TYPES.find((item) => item.title === thinkingTitle);

  if (!connection || !thinking) {
    return null;
  }

  return buildPersonalityResult(connection, thinking);
}

/**
 * @returns {ReturnType<typeof pickRandomPersonalityResult>|null}
 */
export function getUserPersonalityResult() {
  const user = getStoredUser();

  if (!user) {
    return null;
  }

  if (user.personalityResult?.connection && user.personalityResult?.thinking) {
    return user.personalityResult;
  }

  if (typeof user.personalityHeadline === 'string' && user.personalityHeadline.trim()) {
    return resolvePersonalityResultFromHeadline(user.personalityHeadline.trim());
  }

  return null;
}

/**
 * @param {ReturnType<typeof pickRandomPersonalityResult>} result
 */
export function saveUserPersonalityResult(result) {
  updateStoredUser({
    personalityResult: result,
    personalityHeadline: result.headline,
  });
}

/**
 * @returns {ReturnType<typeof pickRandomPersonalityResult>}
 */
export function retakePersonalityTest() {
  const result = pickRandomPersonalityResult();
  saveUserPersonalityResult(result);
  return result;
}
