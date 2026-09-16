/* =============================================================================
WATCH MODE

PURPOSE
-------
Slows headed Playwright runs so a viewer can see each action and the
validated screen. Headless and CI stay fast.

SLOW_MO=0 disables the delay even when headed.
SLOW_MO=800 makes headed playback slower.
============================================================================= */

export function isHeadedRun() {
  return process.argv.includes(
    '--headed'
  ) ||
    process.env.HEADED ===
      'true' ||
    process.env.PWDEBUG ===
      '1';
}

export function watchDelayMs() {
  const configured =
    process.env.SLOW_MO;

  if (
    configured !== undefined &&
    configured !== ''
  ) {
    const parsedValue =
      Number(
        configured
      );

    if (
      Number.isFinite(
        parsedValue
      ) &&
      parsedValue >= 0
    ) {
      return parsedValue;
    }
  }

  return isHeadedRun()
    ? 500
    : 0;
}
