"use client";

import { useEffect, useRef, useState } from "react";

/**
 * BARIL PANIC — easter egg de la page 404.
 * Hommage aux jeux d'arcade à barils : l'artisan grimpe les échafaudages
 * de l'atelier en esquivant les fûts qui dévalent. Canvas 2D, zéro dépendance.
 *
 * Contrôles : ←/→ bouger, ↑ grimper (sur une échelle) ou sauter,
 * ↓ descendre, Espace sauter.
 */

const W = 640;
const H = 720;

// Plateformes (échafaudages) du bas vers le haut
const ROWS = [660, 550, 440, 330, 220, 110];
const PLATFORM_H = 10;

// Échelles : { x, from (étage bas), to (étage haut) }
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
  speed: number; // facteur de vitesse propre au baril
  angle: number; // rotation visuelle
}

type GameState = "title" | "playing" | "gameover";

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export default function BarrelGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<GameState>("title");
  const stateRef = useRef<GameState>("title");
  const keysRef = useRef<Record<string, boolean>>({});
  const startGameRef = useRef<() => void>(() => {});
  const [highScore, setHighScore] = useState(0);
  const [lastScore, setLastScore] = useState(0);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    setHighScore(Number(localStorage.getItem("monbaril-game-hs") || 0));
  }, []);

  // Pression d'une touche depuis les boutons React (mobile + overlay)
  const press = (key: string, down: boolean) => {
    keysRef.current[key] = down;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── État du jeu (mutable, hors React) ────────────────────────────────
    const game = {
      player: {
        x: 60,
        y: ROWS[0] - PLAYER_H,
        vy: 0,
        row: 0,
        jumping: false,
        climbing: false,
        invincible: 0,
        facing: 1,
        jumpLatch: false,
        walkFrame: 0,
      },
      barrels: [] as Barrel[],
      score: 0,
      lives: 3,
      level: 1,
      spawnTimer: 40,
      frame: 0,
    };

    const resetPlayer = (invincible = true) => {
      const p = game.player;
      p.x = 60;
      p.y = ROWS[0] - PLAYER_H;
      p.row = 0;
      p.vy = 0;
      p.jumping = false;
      p.climbing = false;
      p.facing = 1;
      p.invincible = invincible ? 90 : 0;
    };

    const startGame = () => {
      game.barrels = [];
      game.score = 0;
      game.lives = 3;
      game.level = 1;
      game.spawnTimer = 20;
      keysRef.current = {};
      resetPlayer(false);
      setState("playing");
    };
    startGameRef.current = startGame;

    const nextLevel = () => {
      game.score += 1000;
      game.level += 1;
      game.barrels = [];
      resetPlayer(false);
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

    // ── Clavier ───────────────────────────────────────────────────────────
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

      const baseSpeed = 2.4 + game.level * 0.45;

      // Spawn de barils — cadence irrégulière pour casser le rythme
      game.spawnTimer--;
      if (game.spawnTimer <= 0) {
        game.barrels.push({
          x: 100,
          y: ROWS[5] - BARREL_R,
          row: 5,
          dir: 1,
          falling: false,
          vy: 0,
          scored: false,
          speed: rand(0.85, 1.35),
          angle: 0,
        });
        game.spawnTimer = Math.max(30, rand(45, 115) - game.level * 8);
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
          const v = b.dir * baseSpeed * b.speed;
          b.x += v;
          b.angle += v / BARREL_R;
          if ((b.dir === 1 && b.x > W - 30) || (b.dir === -1 && b.x < 30)) {
            if (b.row === 0) {
              b.x = -9999;
            } else {
              b.row -= 1;
              b.falling = true;
            }
          }
        }
      }
      game.barrels = game.barrels.filter((b) => b.x > -100);

      // ── Joueur ──
      const wantsUp = keys["ArrowUp"];
      const wantsJump = wantsUp || keys[" "];

      // Prise d'échelle
      if (!p.jumping && !p.climbing) {
        if (wantsUp) {
          const l = ladderAt(p.x, p.row, true);
          if (l) {
            p.climbing = true;
            p.x = l.x - PLAYER_W / 2;
          }
        }
        if (keys["ArrowDown"] && p.row > 0) {
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
        let moving = false;
        if (keys["ArrowLeft"]) {
          p.x -= PLAYER_SPEED;
          p.facing = -1;
          moving = true;
        }
        if (keys["ArrowRight"]) {
          p.x += PLAYER_SPEED;
          p.facing = 1;
          moving = true;
        }
        if (moving && !p.jumping) p.walkFrame++;
        p.x = Math.max(10, Math.min(W - 10 - PLAYER_W, p.x));

        // Saut — déclenché sur front montant uniquement (pas de rebond en
        // boucle si la touche reste enfoncée)
        if (wantsJump && !p.jumping && !p.jumpLatch) {
          // ↑ prend l'échelle en priorité ; s'il n'y en a pas, on saute
          const onLadder = wantsUp && ladderAt(p.x, p.row, true);
          if (!onLadder) {
            p.jumping = true;
            p.vy = JUMP_VY;
            p.jumpLatch = true;
          }
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
      if (!wantsJump) p.jumpLatch = false;

      if (p.invincible > 0) p.invincible--;

      // Collisions et points de saut
      for (const b of game.barrels) {
        const dx = b.x - (p.x + PLAYER_W / 2);
        const dy = b.y - (p.y + PLAYER_H / 2);
        if (
          Math.abs(dx) < BARREL_R + PLAYER_W / 2 - 4 &&
          Math.abs(dy) < BARREL_R + PLAYER_H / 2 - 4
        ) {
          if (p.invincible === 0) {
            game.lives -= 1;
            if (game.lives <= 0) {
              endGame();
              return;
            }
            resetPlayer();
          }
        }
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

      // Objectif : l'étoile en haut à gauche
      if (p.row === 5 && p.x < 60 && !p.climbing) {
        nextLevel();
      }
    };

    // ── Render ────────────────────────────────────────────────────────────
    const ORANGE = "#f97316";
    const ORANGE_DARK = "#c2410c";
    const DARK = "#1e1e1e";
    const BEIGE = "#f5f0ea";
    const SKIN = "#d4a574";

    // Baril qui roule (vu de face) : cercle + cercles concentriques
    // + rayon tournant pour matérialiser la rotation
    const drawRollingBarrel = (b: Barrel) => {
      ctx.fillStyle = ORANGE;
      ctx.beginPath();
      ctx.arc(b.x, b.y, BARREL_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = ORANGE_DARK;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(b.x, b.y, BARREL_R - 3.5, 0, Math.PI * 2);
      ctx.stroke();
      // Rayon qui tourne avec le roulement
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);
      ctx.beginPath();
      ctx.moveTo(-BARREL_R + 3, 0);
      ctx.lineTo(BARREL_R - 3, 0);
      ctx.stroke();
      ctx.restore();
    };

    // Baril debout (vu de côté) : corps + anneaux horizontaux
    const drawStandingBarrel = (x: number, y: number) => {
      const bw = 20;
      const bh = 28;
      ctx.fillStyle = ORANGE;
      ctx.beginPath();
      ctx.roundRect(x, y - bh, bw, bh, 3);
      ctx.fill();
      ctx.strokeStyle = ORANGE_DARK;
      ctx.lineWidth = 2;
      // Anneaux
      for (const ratio of [0.25, 0.55, 0.85]) {
        ctx.beginPath();
        ctx.moveTo(x, y - bh + bh * ratio);
        ctx.lineTo(x + bw, y - bh + bh * ratio);
        ctx.stroke();
      }
      // Couvercle
      ctx.fillStyle = ORANGE_DARK;
      ctx.beginPath();
      ctx.roundRect(x + 2, y - bh - 2, bw - 4, 4, 2);
      ctx.fill();
    };

    // L'artisan : casque orange, tête, combinaison beige, jambes animées
    const drawPlayer = () => {
      const p = game.player;
      if (p.invincible > 0 && Math.floor(game.frame / 6) % 2 === 1) return;

      const x = p.x;
      const y = p.y;

      // Jambes (pantalon sombre) — animées à la marche
      const legOffset = p.jumping ? 3 : Math.floor(p.walkFrame / 6) % 2 === 0 ? 2 : -2;
      ctx.fillStyle = "#3a3a3a";
      ctx.fillRect(x + 4, y + 22, 5, p.jumping ? 6 : 8);
      ctx.fillRect(x + 13, y + 22, 5, p.jumping ? 6 : 8);
      if (!p.jumping) {
        // léger décalage des pieds pour l'animation de marche
        ctx.fillRect(x + 4 + legOffset, y + 28, 5, 2);
        ctx.fillRect(x + 13 - legOffset, y + 28, 5, 2);
      }

      // Corps : combinaison beige
      ctx.fillStyle = BEIGE;
      ctx.fillRect(x + 3, y + 12, PLAYER_W - 6, 11);

      // Bras côté direction
      ctx.fillRect(p.facing === 1 ? x + PLAYER_W - 5 : x, y + 13, 5, 8);

      // Tête
      ctx.fillStyle = SKIN;
      ctx.fillRect(x + 5, y + 4, PLAYER_W - 10, 8);

      // Œil côté direction
      ctx.fillStyle = DARK;
      ctx.fillRect(p.facing === 1 ? x + PLAYER_W - 8 : x + 6, y + 6, 2, 2);

      // Casque orange
      ctx.fillStyle = ORANGE;
      ctx.beginPath();
      ctx.roundRect(x + 3, y, PLAYER_W - 6, 6, [4, 4, 0, 0]);
      ctx.fill();
      ctx.fillRect(p.facing === 1 ? x + 3 : x + PLAYER_W - 9, y + 4, 6, 2);
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

      // Réserve de barils debout au sommet (le "lanceur")
      drawStandingBarrel(78, ROWS[5]);
      drawStandingBarrel(102, ROWS[5]);
      drawStandingBarrel(126, ROWS[5]);

      // Barils en jeu
      for (const b of game.barrels) {
        drawRollingBarrel(b);
      }

      drawPlayer();

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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Props communs des boutons tactiles — React gère le cycle de vie,
  // plus de listeners orphelins quand l'overlay se démonte/remonte.
  const holdProps = (key: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      press(key, true);
    },
    onPointerUp: () => press(key, false),
    onPointerLeave: () => press(key, false),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

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
              ←/→ bouger, ↑ grimper ou sauter, ↓ descendre.
            </p>
            {highScore > 0 && (
              <p className="mt-2 text-white/40 text-xs font-space-grotesk">
                Record&nbsp;: {highScore}
              </p>
            )}
            <button
              onClick={() => startGameRef.current()}
              className="mt-6 bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold font-space-grotesk hover:bg-orange-600"
            >
              {state === "gameover" ? "Rejouer" : "Jouer"}
            </button>
          </div>
        )}
      </div>

      {/* Contrôles tactiles (mobile) */}
      <div className="mt-4 flex items-center justify-between md:hidden touch-none">
        <div className="flex gap-2">
          <button {...holdProps("ArrowLeft")} className="w-14 h-14 rounded-xl bg-gray-100 text-2xl">←</button>
          <button {...holdProps("ArrowRight")} className="w-14 h-14 rounded-xl bg-gray-100 text-2xl">→</button>
        </div>
        <div className="flex gap-2">
          <button {...holdProps("ArrowUp")} className="w-14 h-14 rounded-xl bg-gray-100 text-2xl">↑</button>
          <button {...holdProps("ArrowDown")} className="w-14 h-14 rounded-xl bg-gray-100 text-2xl">↓</button>
          <button {...holdProps(" ")} className="w-20 h-14 rounded-xl bg-orange-500 text-white font-semibold font-space-grotesk">Saut</button>
        </div>
      </div>
    </div>
  );
}
