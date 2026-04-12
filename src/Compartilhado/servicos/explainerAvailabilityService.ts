export type Slot = {
  id: number;
  date: string;
  time: string;
};

export type Professor = {
  id: number;
  name: string;
  subject: string;
  avatar: string;
};

export const professors: Professor[] = [
  {
    id: 1,
    name: "Prof. João Silva",
    subject: "Matemática",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Prof. Maria Costa",
    subject: "Português",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Prof. David Rocha",
    subject: "Físico química",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Prof. Ana Martins",
    subject: "Inglês",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Prof. Claire Dubois",
    subject: "Francês",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Prof. Rui Gomes",
    subject: "História e Geografia",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: 7,
    name: "Prof. Sofia Alves",
    subject: "Biologia e Geologia",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
];

// SLOT DATA
let slots: Slot[] = [];

export const getSlots = async () => [...slots];

export const addSlot = async (slot: Omit<Slot, "id">) => {
  slots.push({ id: Date.now(), ...slot });
};

export const deleteSlot = async (id: number) => {
  slots = slots.filter((s) => s.id !== id);
};