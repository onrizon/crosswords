import { withData } from "@/lib/Context";
import styles from "@/styles/Game.module.css";
import { AnimatePresence, motion } from "framer-motion";
import GameArea from "./GameArea";
import Menu from "./Menu";
import Progress from "./Progress";
import QrCode from "./QrCode";
import ThemeText from "./ThemeText";
import Timer from "./Timer";
import TopPlayers from "./TopPlayers";

interface GameProps {
  hit: boolean;
}

const Game: React.FC<GameProps> = ({ hit }) => {
  return (
    <>
      <AnimatePresence>
        {hit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={styles.hitOverlay}
          />
        )}
      </AnimatePresence>
      <header className={styles.header}>
        <div className={styles.headerLogoSection}></div>
        <div className={styles.headerContentSection}>
          <ThemeText />
          <Timer />
          <Progress />
          <Menu />
        </div>
      </header>
      <main className={styles.main}>
        <GameArea />
        <div className={styles.sidebar}>
          <TopPlayers />
          <QrCode />
        </div>
      </main>
    </>
  );
};


function mapStateToProps(state: GameProps): GameProps {
  return {
    hit: state.hit,
  };
}

export default withData(Game, mapStateToProps);
