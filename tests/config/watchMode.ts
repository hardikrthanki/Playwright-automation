/* =============================================================================
WATCH MODE

PURPOSE
-------
Optional headed slowdown so a viewer can see each action. Default is full
speed, including headed runs.

Set SLOW_MO=500 (or WATCH=true) when you want to watch playback.
SLOW_MO=0 keeps full speed.
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

  if (
    [
      '1',
      'true',
      'yes',
      'on'
    ].includes(
      (
        process.env.WATCH ??
        ''
      ).toLowerCase()
    )
  ) {
    return 400;
  }

  return 0;
}
