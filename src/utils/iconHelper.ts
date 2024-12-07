import NetflixLogo from "../assets/NetflixLogo";
import SpotifyLogo from "../assets/SpotifyLogo";
import MaxLogo from "../assets/MaxLogo";
import MercadolibreLogo from "../assets/MercadolibreLogo";

const iconMap = {
  netflix: NetflixLogo,
  spotify: SpotifyLogo,
  max: MaxLogo,
  mercadolibre: MercadolibreLogo,
};

export const getIconByName = (iconName: string) => {
  return iconMap[iconName.toLowerCase()] || NetflixLogo;
};

export const getIconName = (IconComponent: any) => {
  return (
    Object.entries(iconMap).find(
      ([_, value]) => value === IconComponent
    )?.[0] || "netflix"
  );
};
