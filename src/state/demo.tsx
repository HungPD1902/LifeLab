import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Task, tasks } from '../data/content';
import { DEMO_ACCOUNT } from '../data/demo-account';

type ClassData = { name: string; description: string; role: 'owner' | 'member' };
type DemoState = {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  registrationPhone: string;
  setRegistrationPhone: (value: string) => void;
  currentClass: ClassData | null;
  setCurrentClass: (value: ClassData | null) => void;
  savedClasses: ClassData[];
  saveClass: (value: ClassData, previousName?: string) => void;
  removeCurrentClass: () => void;
  classTasks: Task[];
  saveTask: (task: Task) => void;
  equipped: string;
  setEquipped: (value: string) => void;
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  pendingMembers: string[];
  setPendingMembers: (value: string[]) => void;
  reset: () => void;
};
const DemoContext = createContext<DemoState | null>(null);

export function DemoProvider({ children }: PropsWithChildren) {
  const [name, setName] = useState<string>(DEMO_ACCOUNT.name);
  const [email, setEmail] = useState<string>(DEMO_ACCOUNT.email);
  const [registrationPhone, setRegistrationPhone] = useState('');
  const [currentClass, setCurrentClass] = useState<ClassData | null>(null);
  const [savedClasses, setSavedClasses] = useState<ClassData[]>([]);
  const [classTasks, setClassTasks] = useState<Task[]>(tasks);
  const saveClass = (value: ClassData, previousName?: string) => {
    setSavedClasses((list) => [
      value,
      ...list.filter((c) => c.name !== (previousName || value.name)),
    ]);
    setCurrentClass(value);
  };
  const removeCurrentClass = () => {
    setSavedClasses((list) => list.filter((c) => c.name !== currentClass?.name));
    setCurrentClass(null);
  };
  const saveTask = (task: Task) =>
    setClassTasks((list) => [task, ...list.filter((t) => t.id !== task.id)]);
  const [equipped, setEquipped] = useState('Ba lô cắm trại');
  const [notifications, setNotifications] = useState(true);
  const [pendingMembers, setPendingMembers] = useState([
    'Nguyễn Minh Anh',
    'Trần Gia Huy',
    'Lê Bảo Ngọc',
  ]);
  const reset = () => {
    setName(DEMO_ACCOUNT.name);
    setEmail(DEMO_ACCOUNT.email);
    setRegistrationPhone('');
    setCurrentClass(null);
    setSavedClasses([]);
    setClassTasks(tasks);
    setEquipped('Ba lô cắm trại');
    setNotifications(true);
    setPendingMembers(['Nguyễn Minh Anh', 'Trần Gia Huy', 'Lê Bảo Ngọc']);
  };
  return (
    <DemoContext.Provider
      value={{
        name,
        setName,
        email,
        setEmail,
        registrationPhone,
        setRegistrationPhone,
        currentClass,
        setCurrentClass,
        savedClasses,
        saveClass,
        removeCurrentClass,
        classTasks,
        saveTask,
        equipped,
        setEquipped,
        notifications,
        setNotifications,
        pendingMembers,
        setPendingMembers,
        reset,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error('DemoProvider is required');
  return value;
}
