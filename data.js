/*
  CATALOGUE — à compléter avec Fawn.
  Pour ajouter une vraie photo : déposer le fichier dans /images et renseigner  img: "images/nom.jpg"
  Tant que img est vide, le site affiche un cadran peint en CSS aux couleurs de l'œuvre (palette).
  status : "dispo" | "vendu" | "commande" | ""   (titres provisoires, à valider par Fawn)
*/
const UNIVERS = [
  { title: "Rêve de nuages",      tech: "Acrylique", format: "A2", status: "dispo", ig: "reel/DR2ic9CDLpG", palette: ["#9fb7d6", "#f1e6d8", "#5b6f93"], img: "" },
  { title: "Édition spéciale",    tech: "Acrylique", format: "A2", status: "",      ig: "reel/DRCahBCDKDM", palette: ["#1b2a4a", "#c9a46a", "#0d1424"], img: "" },
  { title: "Améthyste & lumière", tech: "Acrylique", format: "A2", status: "",      ig: "reel/DR-DWrDDAfi", palette: ["#6b4a8f", "#e7d4f5", "#2d1c44"], img: "" },
  { title: "Disco",               tech: "Acrylique", format: "A2", status: "",      ig: "reel/DRkMr3ojGX0", palette: ["#e94e9b", "#f7d34a", "#3b1d5e"], img: "" },
  { title: "Le serpent",          tech: "Acrylique", format: "A2", status: "",      ig: "reel/DRm4zAdjITO", palette: ["#2f5d3a", "#c8b46a", "#0f2316"], img: "" },
  { title: "Full orange",         tech: "Acrylique", format: "A2", status: "",      ig: "reel/DRNWlHBDGto", palette: ["#e8742a", "#ffd2a1", "#7a2e0c"], img: "" },
  { title: "La préférée",         tech: "Acrylique", format: "A2", status: "",      ig: "reel/DRSUe57DOXq", palette: ["#24395c", "#e6c79a", "#101b30"], img: "" },
  { title: "Royal Oak réinventée",tech: "Acrylique", format: "A3", status: "",      ig: "reel/DSdCyIzjL3m", palette: ["#2b4c6f", "#d9e2ea", "#14263a"], img: "" },
  { title: "Cartier Tank",        tech: "Acrylique", format: "A3", status: "",      ig: "reel/DSNrVZDjMUE", palette: ["#3a1f1f", "#f2d7c2", "#c98b8b"], img: "" },
  { title: "Paysage suisse",      tech: "Acrylique", format: "A3", status: "",      ig: "reel/DT8flkhDEqs", palette: ["#4f7a5a", "#eef2f4", "#24384a"], img: "" },
  { title: "Reverso",             tech: "Acrylique", format: "A3", status: "",      ig: "reel/DTdSgVUjPqb", palette: ["#24323f", "#dfe6ea", "#3d6a82"], img: "" },
  { title: "Nautilus sur toile",  tech: "Acrylique sur toile", format: "", status: "", ig: "reel/DVvrC4pjEkx", palette: ["#1f3c5a", "#b9cde0", "#0b1a2a"], img: "" },
];

const SAISONS = [
  { title: "Printemps", ig: "reel/DTvVMhZjNBS", palette: ["#e8a7b8", "#fbeef0", "#5f7f4f"], img: "" },
  { title: "Été",       ig: "reel/DU3Jw-JjEvV", palette: ["#e9b44c", "#fff3d6", "#2f6f8f"], img: "" },
  { title: "Automne",   ig: "reel/DUTV-1WjFx9", palette: ["#b5562a", "#f2d0a9", "#4a2412"], img: "" },
  { title: "Hiver",     ig: "reel/DUj3namAlka", palette: ["#9db8cf", "#ffffff", "#1c2c3d"], img: "" },
];

const CARNET = [
  ["Patek Philippe Nautilus", "reel/DRxEdPxjO3a"],
  ["Jaeger-LeCoultre Reverso", "reel/DaiPmZts3Ho"],
  ["F.P. Journe", "reel/DYUhA7VMQLa"],
  ["Van Cleef & Arpels", "reel/DRc0RW3jGUr"],
  ["Hermès Arceau Grande Lune", "reel/DbBVFdCMwX1"],
  ["Cartier Crash", "reel/DMsauzUI7WG"],
  ["Omega Speedmaster", "reel/DQfRFdSDJzO"],
  ["Rolex Daytona Rainbow", "reel/DQmf8ECjFJ2"],
  ["Bovet", "reel/DQziC7CDCcI"],
  ["Vacheron Constantin", "reel/DQW0856jG22"],
  ["Chanel Première", "reel/DaLWsDSsbQg"],
  ["Girard-Perregaux Esmeralda", "reel/DMaap-NIsFx"],
  ["Tag Heuer Monaco", "reel/DXCG8iBjC2p"],
  ["Parmigiani Fleurier", "reel/DWuaBVHjAee"],
  ["Louis Moinet", "reel/DXo-NsxBLsV"],
  ["Franck Muller", "reel/DeAGEJyOsY6"],
  ["Voutilainen", "reel/DebMR95uo-J"],
  ["Cartier Santos-Dumont", "reel/DQEsOdajBt2"],
];
