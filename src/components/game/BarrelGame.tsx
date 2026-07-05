"use client";

import { useEffect, useRef, useState } from "react";

/**
 * BARIL PANIC — easter egg de la page 404.
 * Hommage aux jeux d'arcade à barils : l'artisan grimpe les échafaudages
 * de l'atelier en esquivant les fûts qui dévalent. Canvas 2D, zéro dépendance.
 */

const W = 640;
const H = 720;

// Plateformes (échafaudages) du bas vers le haut
const ROWS = [660, 550, 440, 330, 220, 110];
const PLATFORM_H = 10;

// Échelles : { x, fromRow, toRow } — fromRow = étage bas
const LADDERS = [
  { x: 560, from: 0, to: 1 },
  { x: 110, from: 1, to: 2 },
  { x: 470, from: 2, to: 3 },
  { x: 150, from: 3, to: 4 },
  { x: 520, from: 4, to: 5 },
];
const LADDER_W = 26;

const GRAVITY = 0.5;
const JUMP_VY = -9;
const PLAYER_SPEED = 3.2;
const PLAYER_W = 22;
const PLAYER_H = 30;
const BARREL_R = 11;

interface Barrel {
  x: number;
  y: number;
  row: number;
  dir: number;
  falling: boolean;
  vy: number;
  scored: boolean;
}

type GameState = "title" | "playing" | "gameover";

export default function BarrelGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<GameState>("title");
  const stateRef = useRef<GameState>("title");
  const keysRef = useRef<Record<string, boolean>>({});
  const [highScore, setHighScore] = useState(0);
  const [lastScore, setLastScore] = useState(0);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    setHighScore(Number(localStorage.getItem("monbaril-game-hs") || 0));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── État du jeu (mutable, hors React) ────────────────────────────────
    const game = {
      player: { x: 60, y: ROWS[0] - PLAYER_H, vy: 0, row: 0, jumping: false, climbing: false, invincible: 0 },
      barrels: [] as Barrel[],
      score: 0,
      lives: 3,
      level: 1,
      spawnTimer: 60,
      frame: 0,
    };

    const resetPlayer = () => {
      game.player.x = 60;
      game.player.y = ROWS[0] - PLAYER_H;
      game.player.vy = 0;
      game.player.jumping = false;
      game.player.climbing = false;
      game.player.invincible = 90;
    };

    const startGame = () => {
      game.barrels = [];
      game.score = 0;
      game.lives = 3;
      game.level = 1;
      game.spawnTimer = 30;
      resetPlayer();
      game.player.invincible = 0;
      setState("playing");
    };

    const nextLevel = () => {
      game.score += 1000;
      game.level += 1;
      game.barrels = [];
      resetPlayer();
      game.player.invincible = 0;
    };

    const endGame = () => {
      setLastScore(game.score);
      const hs = Number(localStorage.getItem("monbaril-game-hs") || 0);
      if (game.score > hs) {
        localStorage.setItem("monbaril-game-hs", String(game.score));
        setHighScore(game.score);
      }
      setState("gameover");
    };

    // ── Entrées clavier ───────────────────────────────────────────────────
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      keysRef.current[e.key] = true;
      if (stateRef.current !== "playing" && (e.key === " " || e.key === "Enter")) {
        startGame();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Boutons tactiles (délégué via data-key sur les boutons DOM)
    const onTouch = (pressed: boolean) => (e: Event) => {
      const key = (e.currentTarget as HTMLElement).dataset.key;
      if (!key) return;
      e.preventDefault();
      keysRef.current[key] = pressed;
      if (pressed && stateRef.current !== "playing" && key === " ") startGame();
    };
    const touchButtons = Array.from(
      document.querySelectorAll<HTMLElement>("[data-key]")
    );
    const downHandler = onTouch(true);
    const upHandler = onTouch(false);
    touchButtons.forEach((btn) => {
      btn.addEventListener("touchstart", downHandler, { passive: false });
      btn.addEventListener("touchend", upHandler);
      btn.addEventListener("mousedown", downHandler);
      btn.addEventListener("mouseup", upHandler);
      btn.addEventListener("mouseleave", upHandler);
    });

    // ── Helpers ───────────────────────────────────────────────────────────
    const ladderAt = (x: number, row: number, goingUp: boolean) =>
      LADDERS.find(
        (l) =>
          Math.abs(x + PLAYER_W / 2 - l.x) < LADDER_W &&
          (goingUp ? l.from === row : l.to === row)
      );

    // ── Update ────────────────────────────────────────────────────────────
    const update = () => {
      const keys = keysRef.current;
      const p = game.player;
      game.frame++;

      const barrelSpeed = 1.7 + game.level * 0.35;

      // Spawn de barils depuis le sommet (près de l'objectif)
      game.spawnTimer--;
      if (game.spawnTimer <= 0) {
        game.barrels.push({
          x: 80,
          y: ROWS[5] - BARREL_R,
          row: 5,
          dir: 1,
          falling: false,
          vy: 0,
          scored: false,
        });
        game.spawnTimer = Math.max(50, 130 - game.level * 12);
      }

      // Barils
      for (const b of game.barrels) {
        if (b.falling) {
          b.vy += GRAVITY;
          b.y += b.vy;
          const targetY = ROWS[b.row] - BARREL_R;
          if (b.y >= targetY) {
            b.y = targetY;
            b.falling = false;
            b.vy = 0;
            b.dir *= -1;
          }
        } else {
          b.x += b.dir * barrelSpeed;
          // Chute au bord de l'écran vers l'étage inférieur
          if ((b.dir === 1 && b.x > W - 30) || (b.dir === -1 && b.x < 30)) {
            if (b.row === 0) {
              b.x = -9999; // sort du jeu en bas
            } else {
              b.row -= 1;
              b.falling = true;
            }
          }
        }
      }
      game.barrels = game.barrels.filter((b) => b.x > -100);

      // Joueur — échelle
      if (!p.jumping) {
        if (keys["ArrowUp"] && !p.climbing) {
          const l = ladderAt(p.x, p.row, true);
          if (l) {
            p.climbing = true;
            p.x = l.x - PLAYER_W / 2;
          }
        }
        if (keys["ArrowDown"] && !p.climbing && p.row > 0) {
          const l = ladderAt(p.x, p.row, false);
          if (l) {
            p.climbing = true;
            p.x = l.x - PLAYER_W / 2;
          }
        }
      }

      if (p.climbing) {
        if (keys["ArrowUp"]) p.y -= 2.2;
        if (keys["ArrowDown"]) p.y += 2.2;
        // Arrivée en haut / bas de l'échelle
        const above = ROWS[p.row + 1];
        const below = ROWS[p.row];
        if (above !== undefined && p.y <= above - PLAYER_H) {
          p.y = above - PLAYER_H;
          p.row += 1;
          p.climbing = false;
        }
        if (p.y >= below - PLAYER_H) {
          p.y = below - PLAYER_H;
          p.climbing = false;
        }
      } else {
        // Déplacement horizontal
        if (keys["ArrowLeft"]) p.x -= PLAYER_SPEED;
        if (keys["ArrowRight"]) p.x += PLAYER_SPEED;
        p.x = Math.max(10, Math.min(W - 10 - PLAYER_W, p.x));

        // Saut
        if (keys[" "] && !p.jumping) {
          p.jumping = true;
          p.vy = JUMP_VY;
        }
        if (p.jumping) {
          p.vy += GRAVITY;
          p.y += p.vy;
          const floor = ROWS[p.row] - PLAYER_H;
          if (p.y >= floor) {
            p.y = floor;
            p.jumping = false;
            p.vy = 0;
          }
        }
      }

      if (p.invincible > 0) p.invincible--;

      // Collisions et points de saut
      for (const b of game.barrels) {
        const dx = b.x - (p.x + PLAYER_W / 2);
        const dy = b.y - (p.y + PLAYER_H / 2);
        if (Math.abs(dx) < BARREL_R + PLAYER_W / 2 - 4 && Math.abs(dy) < BARREL_R + PLAYER_H / 2 - 4) {
          if (p.invincible === 0) {
            game.lives -= 1;
            if (game.lives <= 0) {
              endGame();
              return;
            }
            resetPlayer();
          }
        }
        // +100 quand on saute par-dessus un baril
        if (
          !b.scored &&
          p.jumping &&
          b.row === p.row &&
          Math.abs(dx) < 20 &&
          b.y > p.y + PLAYER_H
        ) {
          b.scored = true;
          game.score += 100;
        }
      }

      // Objectif atteint : plateforme du haut, zone de l'étoile
      if (p.row === 5 && p.x < 60) {
        nextLevel();
      }
    };

    // ── Render ────────────────────────────────────────────────────────────
    const ORANGE = "#f97316";
    const DARK = "#1e1e1e";
    const BEIGE = "#f5f0ea";

    const drawBarrel = (x: number, y: number, r: number) => {
      ctx.fillStyle = ORANGE;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#c2410c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, r - 3.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#c2410c";
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = () => {
      ctx.fillStyle = DARK;
      ctx.fillRect(0, 0, W, H);

      // Échafaudages
      ctx.fillStyle = "#3a3a3a";
      for (const y of ROWS) {
        ctx.fillRect(20, y, W - 40, PLATFORM_H);
      }
      ctx.fillStyle = ORANGE;
      for (const y of ROWS) {
        ctx.fillRect(20, y, W - 40, 2);
      }

      // Échelles
      ctx.strokeStyle = BEIGE;
      ctx.lineWidth = 3;
      for (const l of LADDERS) {
        const y1 = ROWS[l.to];
        const y2 = ROWS[l.from];
        ctx.beginPath();
        ctx.moveTo(l.x - LADDER_W / 2, y1);
        ctx.lineTo(l.x - LADDER_W / 2, y2);
        ctx.moveTo(l.x + LADDER_W / 2, y1);
        ctx.lineTo(l.x + LADDER_W / 2, y2);
        ctx.stroke();
        for (let ry = y1 + 12; ry < y2; ry += 16) {
          ctx.beginPath();
          ctx.moveTo(l.x - LADDER_W / 2, ry);
          ctx.lineTo(l.x + LADDER_W / 2, ry);
          ctx.stroke();
        }
      }

      // Objectif : l'étoile MonBaril en haut à gauche
      ctx.fillStyle = ORANGE;
      ctx.save();
      ctx.translate(40, ROWS[5] - 28);
      ctx.beginPath();
      const s = 16;
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, 0, s, 0);
      ctx.quadraticCurveTo(0, 0, 0, s);
      ctx.quadraticCurveTo(0, 0, -s, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s);
      ctx.fill();
      ctx.restore();

      // Pile de barils au sommet (le "lanceur")
      drawBarrel(85, ROWS[5] - BARREL_R - 1, BARREL_R);
      drawBarrel(107, ROWS[5] - BARREL_R - 1, BARREL_R);

      // Barils en jeu
      for (const b of game.barrels) {
        drawBarrel(b.x, b.y, BARREL_R);
      }

      // Joueur (l'artisan : combinaison beige, casque orange)
      const p = game.player;
      if (p.invincible === 0 || Math.floor(game.frame / 6) % 2 === 0) {
        ctx.fillStyle = BEIGE;
        ctx.fillRect(p.x, p.y + 8, PLAYER_W, PLAYER_H - 8);
        ctx.fillStyle = "#d4a574";
        ctx.fillRect(p.x + 4, p.y + 2, PLAYER_W - 8, 10);
        ctx.fillStyle = ORANGE;
        ctx.fillRect(p.x + 2, p.y, PLAYER_W - 4, 5);
      }

      // HUD
      ctx.fillStyle = BEIGE;
      ctx.font = "16px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`SCORE ${game.score}`, 24, 30);
      ctx.textAlign = "center";
      ctx.fillText(`NIVEAU ${game.level}`, W / 2, 30);
      ctx.textAlign = "right";
      ctx.fillText(`♥ ${game.lives}`, W - 24, 30);
    };

    // ── Boucle ────────────────────────────────────────────────────────────
    let raf = 0;
    const loop = () => {
      if (stateRef.current === "playing") {
        update();
        render();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      touchButtons.forEach((btn) => {
        btn.removeEventListener("touchstart", downHandler);
        btn.removeEventListener("touchend", upHandler);
        btn.removeEventListener("mousedown", downHandler);
        btn.removeEventListener("mouseup", upHandler);
        btn.removeEventListener("mouseleave", upHandler);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-[640px] mx-auto select-none">
      <div className="relative rounded-2xl overflow-hidden border border-gray-800">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full h-auto block bg-[#1e1e1e]"
        />

        {state !== "playing" && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-8">
            <p className="text-orange-500 text-xs tracking-[0.3em] font-space-grotesk mb-3">
              +&nbsp;&nbsp;EASTER EGG DE L&apos;ATELIER
            </p>
            <h2 className="text-5xl md:text-6xl font-bebas-neue text-white uppercase tracking-wide leading-none">
              Baril Panic
            </h2>
            {state === "gameover" && (
              <p className="mt-4 text-white/90 font-space-grotesk">
                Score&nbsp;: <span className="text-orange-500 font-bold">{lastScore}</span>
                {lastScore >= highScore && lastScore > 0 && " — nouveau record !"}
              </p>
            )}
            <p className="mt-4 text-white/60 text-sm font-space-grotesk max-w-xs">
              Grimpez jusqu&apos;à l&apos;étoile en esquivant les fûts.
              Flèches pour bouger et grimper, Espace pour sauter.
            </p>
            {highScore > 0 && (
              <p className="mt-2 text-white/40 text-xs font-space-grotesk">
                Record&nbsp;: {highScore}
              </p>
            )}
            <button
              data-key=" "
              className="mt-6 bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold font-space-grotesk hover:bg-orange-600"
            >
              {state === "gameover" ? "Rejouer" : "Jouer"}
            </button>
          </div>
        )}
      </div>

      {/* Contrôles tactiles (mobile) */}
      <div className="mt-4 flex items-center justify-between md:hidden">
        <div className="flex gap-2">
          <button data-key="ArrowLeft" className="w-14 h-14 rounded-xl bg-gray-100 text-2xl">←</button>
          <button data-key="ArrowRight" className="w-14 h-14 rounded-xl bg-gray-100 text-2xl">→</button>
        </div>
        <div className="flex gap-2">
          <button data-key="ArrowUp" className="w-14 h-14 rounded-xl bg-gray-100 text-2xl">↑</button>
          <button data-key="ArrowDown" className="w-14 h-14 rounded-xl bg-gray-100 text-2xl">↓</button>
          <button data-key=" " className="w-20 h-14 rounded-xl bg-orange-500 text-white font-semibold font-space-grotesk">Saut</button>
        </div>
      </div>
    </div>
  );
}
