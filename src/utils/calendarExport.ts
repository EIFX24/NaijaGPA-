import { AcademicDeadline } from '../types/academic';

/**
 * Generates an RFC 5545 compliant iCalendar (.ics) string from academic deadlines
 */
export function generateICalendarString(deadlines: AcademicDeadline[], institution: string = 'Nigerian University'): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const formatToICalDate = (dateStr: string, timeStr?: string): string => {
    // dateStr: YYYY-MM-DD
    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];

    if (timeStr && timeStr.includes(':')) {
      const [hh, mm] = timeStr.split(':');
      return `${y}${m}${d}T${hh}${mm}00`;
    }
    // All day
    return `${y}${m}${d}`;
  };

  const now = new Date();
  const dtStamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NaijaGPA//Nigerian Academic Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${institution} Academic Deadlines`,
  ];

  for (const d of deadlines) {
    const isAllDay = !d.time;
    const dtStart = formatToICalDate(d.date, d.time);
    if (!dtStart) continue;

    const summary = `[${d.courseCode}] ${d.title} (${d.type.toUpperCase().replace('_', ' ')})`;
    const description = `Academic deadline for ${d.courseCode}. Venue: ${d.venue || 'TBA'}. Notes: ${d.notes || 'None'}`;
    const location = d.venue || 'Campus Examination Hall / Classroom';

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:naijagpa-${d.id}@naijagpa.local`);
    lines.push(`DTSTAMP:${dtStamp}`);
    if (isAllDay) {
      lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
    } else {
      lines.push(`DTSTART:${dtStart}`);
    }
    lines.push(`SUMMARY:${summary.replace(/,/g, '\\,')}`);
    lines.push(`DESCRIPTION:${description.replace(/,/g, '\\,')}`);
    lines.push(`LOCATION:${location.replace(/,/g, '\\,')}`);
    lines.push('STATUS:CONFIRMED');
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-PT24H');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:Reminder: ${summary.replace(/,/g, '\\,')}`);
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Triggers a client-side download of the .ics file
 */
export function downloadICalendarFile(deadlines: AcademicDeadline[], institution: string): void {
  const icsData = generateICalendarString(deadlines, institution);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'NaijaGPA_Exam_Deadlines.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Creates a direct Google Calendar add event web link
 */
export function createGoogleCalendarUrl(deadline: AcademicDeadline): string {
  const title = encodeURIComponent(`[${deadline.courseCode}] ${deadline.title}`);
  const details = encodeURIComponent(`Academic schedule tracked via NaijaGPA. Venue: ${deadline.venue || 'TBA'}. ${deadline.notes || ''}`);
  const location = encodeURIComponent(deadline.venue || 'Campus');

  const dateClean = deadline.date.replace(/-/g, '');
  let dates = '';
  if (deadline.time && deadline.time.includes(':')) {
    const [hh, mm] = deadline.time.split(':');
    const start = `${dateClean}T${hh}${mm}00`;
    // Add 2 hours duration by default for exams/tests
    const endH = (parseInt(hh, 10) + 2) % 24;
    const endHStr = endH < 10 ? `0${endH}` : `${endH}`;
    const end = `${dateClean}T${endHStr}${mm}00`;
    dates = `${start}/${end}`;
  } else {
    dates = `${dateClean}/${dateClean}`;
  }

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}
