export function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  const [first, ...rest] = [...intervals].sort((a, b) => a.bt - b.bt);
  return rest.reduce((acc, interval) => {
    const last = acc[acc.length - 1];
    if (last.et + 1 >= interval.bt) {
      last.et = Math.max(last.et, interval.et);
    } else {
      acc.push(interval);
    }
    return acc;
  }, [first]);
}

export function removeInterval(intervals, start, end) {
  return intervals.reduce((acc, interval) => {
    if (interval.bt >= start && interval.et <= end) {
      return acc;
    }

    if (interval.bt < start && interval.et > end) {

      acc.push({ bt: interval.bt, et: start - 1 });
      acc.push({ bt: end + 1, et: interval.et });
    } else if (interval.et >= start && interval.bt < start) {
      acc.push({ bt: interval.bt, et: start - 1 });
    } else if (interval.bt <= end && interval.et > end) {
      acc.push({ bt: end + 1, et: interval.et });
    } else {

      acc.push(interval);
    }
    return acc;
  }, []);
}

export function isDayFullySelected(intervals) {
  const merged = mergeIntervals(intervals);
  return merged.length === 1 && merged[0].bt === 0 && merged[0].et === 1439;
}

export function isHourSelected(intervals, hourInMinutes) {
  return intervals.some(
    (interval) => interval.bt <= hourInMinutes && interval.et >= hourInMinutes + 59
  );
}
