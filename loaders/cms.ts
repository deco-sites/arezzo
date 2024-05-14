
export interface Config {
  text: string;
  age: number;
  showMenu: boolean;
}

interface Props {

  configs?: Config[];
}

interface Returns {
  configs?: Config[];
}


export default function loader({ configs }: Props): Returns {
  return { 
    configs,
  }
}