import { modules } from "./content";
import { walkthroughs } from "./lesson-details";
import {
  interviewTopics,
  sqlTasks,
  capstoneCases,
  seedBugs,
} from "./practice-data";
export type SearchEntry = {
  id: string;
  title: string;
  text: string;
  label: string;
  route: string;
};
const entries: SearchEntry[] = [
  ...modules.flatMap((m) =>
    m.lessons.map((l, i) => ({
      id: l.id,
      title: l.title,
      text: [
        l.term,
        l.theory,
        l.example,
        l.practice,
        l.mistake,
        ...walkthroughs[(m.id - 1) * 6 + i],
      ].join(" "),
      label: m.title,
      route: `module/${m.id}/${l.id}`,
    })),
  ),
  ...modules.flatMap((m) =>
    m.questions.map((q) => ({
      id: q.id,
      title: q.prompt,
      text: [...q.options, q.explanation].join(" "),
      label: `Quiz · ${m.title}`,
      route: `module/${m.id}/quiz`,
    })),
  ),
  ...interviewTopics.map((q, i) => ({
    id: `interview-${i}`,
    title: q[0],
    text: q.slice(1).join(" "),
    label: "Interview bank · EN / RU",
    route: "interview",
  })),
  ...sqlTasks.map((t, i) => ({
    id: `sql-${i}`,
    title: t[0],
    text: t[1],
    label: "SQL task",
    route: "module/4/practice",
  })),
  ...capstoneCases.map((t) => ({
    id: `case-${t[0]}`,
    title: t[0] + " · " + t[1],
    text: t[2],
    label: "Capstone test case",
    route: "module/12/practice",
  })),
  ...seedBugs.map((b) => ({
    id: `bug-${b[0]}`,
    title: b[0] + " · " + b[1],
    text: b.slice(2).join(" "),
    label: "Capstone · учебный defect",
    route: "module/12/practice",
  })),
];
export function searchContent(query: string) {
  const words = query
    .trim()
    .toLocaleLowerCase("ru")
    .split(/\s+/)
    .filter(Boolean);
  return words.length
    ? entries.filter((e) =>
        words.every((w) =>
          [e.title, e.text, e.label]
            .join(" ")
            .toLocaleLowerCase("ru")
            .includes(w),
        ),
      )
    : [];
}
