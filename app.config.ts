export type Feature = {
  title: string;
  description: string;
};

export const appConfig = {
  name: "Delivery Management",
  description:
    "Check the orders each delivery person has taken and map every route to them",
  emoji: "🚚",
  accent: "#ea580c",
  upcomingFeatures: [
    {
      title: "Delivery team roster",
      description: "Add, edit and list the delivery people on your team.",
    },
    {
      title: "Order assignment",
      description: "Assign each incoming order to a delivery person.",
    },
    {
      title: "Orders per driver",
      description: "See every order a delivery person has taken, with its status.",
    },
    {
      title: "Route map",
      description: "Plot each driver's stops on a map in delivery order.",
    },
    {
      title: "Delivery status updates",
      description: "Let drivers mark orders as picked up or delivered.",
    },
  ] satisfies Feature[],
};
