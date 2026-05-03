interface SectionIntroProps {
  eyebrow: string;
  title: string;
  copy: string;
  id: string;
  label?: string;
}

export function SectionIntro({ eyebrow, title, copy, id, label = "Product system" }: SectionIntroProps) {
  return (
    <>
      <div className="sectionNumber">{eyebrow}</div>
      <div className="sectionTitle">
        <span className="monoLabel">{label}</span>
        <h2 className="drop" id={id}>
          {title}
        </h2>
      </div>
      <div className="sectionCopy">
        <p>{copy}</p>
      </div>
    </>
  );
}
