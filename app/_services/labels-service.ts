export type Label = {
  id: number;
  name: string;
  color: string;
};

export function createLabel(name :string, color : string) : Label {
  const labels: Label[] = JSON.parse(localStorage.getItem("labels") || "[]") as Label[];
  const newLabel = {
    id: Math.floor(Date.now() + Math.random()),
    name,
    color,
  };
  labels.push(newLabel);
  localStorage.setItem("labels", JSON.stringify(labels));
  return newLabel;
}

export function deleteLabel(labelId : number) : void {
  let labels: Label[] = JSON.parse(localStorage.getItem("labels") || "[]") as Label[];
  labels = labels.filter((label) => label.id !== Number(labelId));
  localStorage.setItem("labels", JSON.stringify(labels));
}