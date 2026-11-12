# Animacije za kviz „Matematika“ (manim, https://www.manim.community).
# Prave se kao kratki animirani WebP koji se ponavlja – na telefonu se prikazuje kao obična slika
# (medij „slika“, najčešće u „medijiOdgovora“). Pokretanje: alati/manim/renderuj.sh [ImeScene …]
# Na animacijama su samo brojevi, slova promenljivih i znaci – ništa što bi trebalo preslovljavati.
from manim import *
import numpy as np

POZ = "#0e1621"
PLAVA, ROZE, ZELENA, ZUTA, LJUB, NAR = "#74b9ff", "#fd79a8", "#55efc4", "#ffeaa7", "#a29bfe", "#fab1a0"
config.background_color = POZ
# kadar 640×400 (16:10), slika ispunjava ~4,4 jedinice visine
config.frame_height = 4.4
config.frame_width = 4.4 * 1.6
FONT = "DejaVu Sans"


def T(s, vel=36, boja=WHITE):
    return Text(s, font=FONT, font_size=vel, color=boja)


class Pitagora(Scene):
    """c² = a² + b²: četiri ista trougla u kvadratu stranice a+b, pa preslagivanje."""
    def construct(self):
        a, b = 1.1, 1.9
        s = a + b
        o = np.array([-s / 2, -s / 2 + 0.3, 0])
        P = lambda x, y: o + np.array([x, y, 0])
        okvir = Square(s).move_to(P(s / 2, s / 2)).set_stroke(WHITE, 3)
        boje = [PLAVA, ROZE, ZELENA, NAR]
        tr1 = [
            Polygon(P(0, 0), P(b, 0), P(0, a)),
            Polygon(P(s, 0), P(b, 0), P(s, b)),
            Polygon(P(s, s), P(s, b), P(a, s)),
            Polygon(P(0, s), P(a, s), P(0, a)),
        ]
        for t, c in zip(tr1, boje):
            t.set_fill(c, 0.75).set_stroke(WHITE, 2)
        c2 = Polygon(P(b, 0), P(s, b), P(a, s), P(0, a)).set_fill(ZUTA, 0.35).set_stroke(ZUTA, 3)
        nat_c = T("c²", 44, ZUTA).move_to(c2)
        self.play(Create(okvir))
        self.play(LaggedStart(*[FadeIn(t) for t in tr1], lag_ratio=0.2))
        self.play(FadeIn(c2), Write(nat_c))
        self.wait(1)
        # preslagivanje: isti trouglovi ostavljaju prazne kvadrate a² i b²
        # isti trouglovi (temena istim redom: pravi ugao, kraj katete a, kraj katete b) na novom mestu
        tr2 = [
            Polygon(P(0, 0), P(b, 0), P(0, a)),  # ostaje
            Polygon(P(b, a), P(b, 0), P(0, a)),  # okret 90°
            Polygon(P(s, a), P(b, a), P(s, s)),  # okret −90°
            Polygon(P(b, s), P(s, s), P(b, a)),  # pomeranje udesno
        ]
        for t, c in zip(tr2, boje):
            t.set_fill(c, 0.75).set_stroke(WHITE, 2)
        self.play(FadeOut(c2), FadeOut(nat_c))
        self.play(*[Transform(x, y, path_arc=l) for x, y, l in zip(tr1, tr2, [0, PI / 2, -PI / 2, 0])], run_time=2)
        a2 = Square(a).move_to(P(b + a / 2, a / 2)).set_fill(PLAVA, 0.3).set_stroke(PLAVA, 3)
        b2 = Square(b).move_to(P(b / 2, a + b / 2)).set_fill(ROZE, 0.3).set_stroke(ROZE, 3)
        self.play(FadeIn(a2), FadeIn(b2), Write(T("a²", 34, PLAVA).move_to(a2)), Write(T("b²", 44, ROZE).move_to(b2)))
        self.play(Write(T("c² = a² + b²", 34, ZUTA).next_to(okvir, DOWN, 0.25)))
        self.wait(3)


def mreza_kvadrata(n, a, poc, boja_fn):
    """n×n kvadratića stranice a; boja_fn(i, j) -> boja ili None (j raste nagore)."""
    g = VGroup()
    for j in range(n):
        for i in range(n):
            b = boja_fn(i, j)
            if b is None:
                continue
            g.add(Square(a).move_to(poc + np.array([(i + 0.5) * a, (j + 0.5) * a, 0])).set_fill(b, 0.8).set_stroke(WHITE, 1.5))
    return g


class NeparniKvadrat(Scene):
    """1 + 3 + 5 + 7 + 9 = 5²: svaki neparan broj dodaje „ugao“ kvadratu."""
    def construct(self):
        a, n = 0.62, 5
        poc = np.array([-n * a / 2 - 1.2, -n * a / 2 + 0.25, 0])
        boje = [ZUTA, ROZE, ZELENA, PLAVA, LJUB]
        zapis = VGroup()
        for k in range(n):
            ugao = mreza_kvadrata(n, a, poc, lambda i, j: boje[k] if max(i, n - 1 - j) == k else None)
            t = T(("" if k == 0 else "+ ") + str(2 * k + 1), 30, boje[k])
            zapis.add(t)
            zapis.arrange(DOWN, aligned_edge=LEFT, buff=0.08).move_to([1.6, 0.6, 0])
            self.play(FadeIn(ugao, shift=0.2 * (RIGHT + DOWN)), FadeIn(t), run_time=0.8)
        rez = T("= 5 · 5 = 25", 30, ZUTA).next_to(zapis, DOWN, 0.25).align_to(zapis, LEFT)
        self.play(Write(rez))
        self.wait(3)


class GeometrijskiRed(Scene):
    """1/2 + 1/4 + 1/8 + … = 1: polovine preostalog dela kvadrata."""
    def construct(self):
        st = 3.6
        poc = np.array([-3.4, -st / 2, 0])
        self.play(Create(Square(st).move_to(poc + np.array([st / 2, st / 2, 0])).set_stroke(WHITE, 3)))
        x, y, w, h = 0.0, 0.0, st, st
        boje = [PLAVA, ROZE, ZELENA, ZUTA, LJUB, NAR, PLAVA, ROZE]
        natpisi = ["1/2", "1/4", "1/8", "1/16"]
        for k in range(8):
            if k % 2 == 0:
                w /= 2; deo = (x, y, w, h); x += w
            else:
                h /= 2; deo = (x, y, w, h); y += h
            dx, dy, dw, dh = deo
            r = Rectangle(width=dw, height=dh).move_to(poc + np.array([dx + dw / 2, dy + dh / 2, 0])).set_fill(boje[k], 0.85).set_stroke(WHITE, 1.5)
            anim = [FadeIn(r)]
            if k < 4:
                anim.append(FadeIn(T(natpisi[k], 30 - 4 * k, POZ).move_to(r)))
            self.play(*anim, run_time=0.7 if k < 4 else 0.35)
        z = T("1/2 + 1/4 + 1/8 + …", 24).move_to([1.95, 0.5, 0])
        self.play(Write(z))
        self.play(Write(T("= 1", 44, ZUTA).next_to(z, DOWN, 0.3)))
        self.wait(3)


class RacionalniGusti(Scene):
    """Između 0 i 1 uvek ima još razlomaka: sredine se dodaju beskonačno."""
    def construct(self):
        L = 6.0
        lin = Line([-L / 2, -0.3, 0], [L / 2, -0.3, 0]).set_stroke(WHITE, 3)
        self.play(Create(lin), Write(T("0", 32).next_to(lin.get_start(), DOWN)), Write(T("1", 32).next_to(lin.get_end(), DOWN)))
        X = lambda q: -L / 2 + q * L
        tacke = {0.0, 1.0}
        boje = [ZUTA, ROZE, ZELENA, PLAVA, LJUB, NAR, WHITE]
        for k in range(1, 8):
            nove = [m / 2 ** k for m in range(1, 2 ** k, 2)]
            g = VGroup(*[Dot([X(q), -0.3, 0], radius=max(0.03, 0.09 - 0.012 * k), color=boje[k - 1]) for q in nove])
            anim = [LaggedStart(*[GrowFromCenter(d) for d in g], lag_ratio=0.03)]
            if k <= 3:
                anim += [FadeIn(T(f"{m}/{2 ** k}", 28 - 3 * k, boje[k - 1]).move_to([X(m / 2 ** k), 0.25 + 0.5 * (k - 1), 0])) for m in range(1, 2 ** k, 2)]
            self.play(*anim, run_time=0.9 if k <= 4 else 0.6)
        self.play(Write(T("∞", 60, ZUTA).move_to([0, -1.4, 0])))
        self.wait(3)


class KorenIzDva(Scene):
    """Dijagonala jediničnog kvadrata se šestarom prenese na brojevnu pravu: √2."""
    def construct(self):
        j = 1.9  # jedinica
        y0 = -1.2
        X = lambda x: np.array([-2.6 + x * j, y0, 0])
        osa = Arrow(X(-0.3), X(2.35), buff=0, stroke_width=3, tip_length=0.2, color=WHITE)
        self.play(Create(osa), *[Write(T(str(k), 28).next_to(X(k), DOWN, 0.15)) for k in range(3)],
                  *[Create(Line(X(k) + 0.1 * UP, X(k) + 0.1 * DOWN)) for k in range(3)])
        kv = Polygon(X(0), X(1), X(1) + j * UP, X(0) + j * UP).set_fill(PLAVA, 0.3).set_stroke(PLAVA, 3)
        self.play(DrawBorderThenFill(kv))
        self.play(Write(T("1", 28, PLAVA).next_to(Line(X(1), X(1) + j * UP), RIGHT, 0.1)))
        d = Line(X(0), X(1) + j * UP).set_stroke(ROZE, 5)
        self.play(Create(d))
        luk = Arc(radius=np.sqrt(2) * j, start_angle=PI / 4, angle=-PI / 4, arc_center=X(0)).set_stroke(ZUTA, 3)
        self.play(Rotate(d, -PI / 4, about_point=X(0)), Create(luk), run_time=2)
        tacka = Dot(X(np.sqrt(2)), color=ROZE, radius=0.09)
        self.play(GrowFromCenter(tacka))
        self.play(Write(T("√2 ≈ 1,414…", 34, ROZE).next_to(tacka, DOWN, 0.5)))
        self.wait(3)


class PiKotrljanje(Scene):
    """Točak prečnika 1 se okrene jednom i pređe put π."""
    def construct(self):
        j = 1.6
        R = j / 2
        y0 = -1.1
        x0 = -2.65
        X = lambda x: np.array([x0 + x * j, y0, 0])
        osa = Line(X(-0.1), X(3.5)).set_stroke(WHITE, 3)
        self.play(Create(osa), *[Write(T(str(k), 28).next_to(X(k), DOWN, 0.15)) for k in range(4)],
                  *[Create(Line(X(k) + 0.1 * UP, X(k) + 0.1 * DOWN)) for k in range(4)])
        t = ValueTracker(0)
        def tocak():
            u = t.get_value()
            c = X(u * PI) + R * UP
            k = Circle(R).move_to(c).set_stroke(PLAVA, 4)
            fi = -(u * PI * j) / R  # ugao okretanja = pređeni put / poluprečnik
            p = c + R * np.array([np.sin(fi), -np.cos(fi), 0])
            return VGroup(k, Line(c, p).set_stroke(PLAVA, 2), Dot(p, color=ROZE, radius=0.08), Line(c - R * RIGHT, c + R * RIGHT).set_stroke(ZUTA, 2))
        tk = always_redraw(tocak)
        self.add(tk)
        self.play(Write(T("d = 1", 28, ZUTA).move_to([-2.4, 1.6, 0])))
        trag = always_redraw(lambda: Line(X(0), X(t.get_value() * PI)).set_stroke(ROZE, 6))
        self.add(trag)
        self.play(t.animate.set_value(1), run_time=4, rate_func=linear)
        self.play(Write(T("π ≈ 3,14", 40, ROZE).move_to([1.0, 1.6, 0])))
        self.wait(3)


class KvadratZbira(Scene):
    """(a + b)² = a² + 2ab + b²."""
    def construct(self):
        a, b = 2.0, 1.2
        o = np.array([-3.0, -1.75, 0])
        P = lambda x, y: o + np.array([x, y, 0])
        okvir = Square(a + b).move_to(P((a + b) / 2, (a + b) / 2)).set_stroke(WHITE, 3)
        self.play(Create(okvir), Write(T("a", 30).move_to(P(a / 2, a + b + 0.25))), Write(T("b", 30).move_to(P(a + b / 2, a + b + 0.25))),
                  Write(T("a", 30).move_to(P(-0.25, b + a / 2))), Write(T("b", 30).move_to(P(-0.25, b / 2))))
        delovi = [
            (Rectangle(width=a, height=a).move_to(P(a / 2, b + a / 2)), PLAVA, "a²"),
            (Rectangle(width=b, height=a).move_to(P(a + b / 2, b + a / 2)), ZELENA, "ab"),
            (Rectangle(width=a, height=b).move_to(P(a / 2, b / 2)), ZELENA, "ab"),
            (Rectangle(width=b, height=b).move_to(P(a + b / 2, b / 2)), ROZE, "b²"),
        ]
        for r, c, n in delovi:
            r.set_fill(c, 0.6).set_stroke(c, 2)
            self.play(FadeIn(r), Write(T(n, 30, WHITE).move_to(r)), run_time=0.7)
        f = VGroup(T("(a + b)²", 30), T("= a² + 2ab + b²", 30, ZUTA)).arrange(DOWN, aligned_edge=LEFT).move_to([2.05, 0, 0])
        self.play(Write(f))
        self.wait(3)


class RazlikaKvadrata(Scene):
    """a² − b² = (a + b)(a − b): iz kvadrata se izreže manji, ostatak se preslaže u pravougaonik."""
    def construct(self):
        a, b = 2.4, 0.9
        o = np.array([-2.6, -1.1, 0])
        P = lambda x, y: o + np.array([x, y, 0])
        veliki = Square(a).move_to(P(a / 2, a / 2)).set_fill(PLAVA, 0.5).set_stroke(PLAVA, 3)
        na = T("a", 30).move_to(P(a / 2, -0.3))
        self.play(FadeIn(veliki), Write(na))
        mali = Square(b).move_to(P(a - b / 2, a - b / 2)).set_fill(ROZE, 0.7).set_stroke(ROZE, 3)
        nb = T("b", 26).move_to(P(a - b / 2, a + 0.25))
        self.play(FadeIn(mali), Write(nb))
        self.play(FadeOut(mali), FadeOut(veliki), FadeOut(nb))
        d1 = Rectangle(width=a, height=a - b).move_to(P(a / 2, (a - b) / 2)).set_fill(PLAVA, 0.6).set_stroke(WHITE, 2)
        d2 = Rectangle(width=a - b, height=b).move_to(P((a - b) / 2, a - b / 2)).set_fill(ZELENA, 0.6).set_stroke(WHITE, 2)
        self.add(d1, d2)
        self.wait(0.6)
        # gornji deo se okrene i stavi desno od donjeg: pravougaonik (a + b) × (a − b)
        cilj = Rectangle(width=b, height=a - b).move_to(P(a + b / 2, (a - b) / 2)).set_fill(ZELENA, 0.6).set_stroke(WHITE, 2)
        self.play(Transform(d2, cilj, path_arc=-PI / 2), FadeOut(na), run_time=2)
        self.play(Write(T("a + b", 30, ZUTA).move_to(P((a + b) / 2, -0.35))), Write(T("a − b", 30, ZUTA).move_to(P(a + b + 0.65, (a - b) / 2))))
        self.play(Write(T("a² − b² = (a + b)(a − b)", 30, ZUTA).move_to([0, 1.75, 0])))
        self.wait(3)


class Stepenice(Scene):
    """1 + 2 + 3 + 4 = 4 · 5 : 2: dve iste stepenice čine pravougaonik."""
    def construct(self):
        n, a = 4, 0.62
        o = np.array([-2.6, -1.5, 0])
        def stepenica(boja, okrenuta=False):
            g = VGroup()
            for k in range(n):  # kolona k ima k + 1 kvadratića
                for j in range(k + 1):
                    x, y = (k, j) if not okrenuta else (n - 1 - k, n - j)
                    g.add(Square(a).move_to(o + np.array([(x + 0.5) * a, (y + 0.5) * a, 0])).set_fill(boja, 0.8).set_stroke(WHITE, 1.5))
            return g
        s1 = stepenica(PLAVA)
        self.play(LaggedStart(*[FadeIn(k) for k in s1], lag_ratio=0.08))
        self.play(Write(T("1 + 2 + 3 + 4", 30).move_to([1.8, 1.0, 0])))
        s2 = stepenica(ROZE).shift(4.5 * RIGHT)
        self.play(FadeIn(s2))
        cilj = stepenica(ROZE, True)
        self.play(Transform(s2, cilj, path_arc=PI), run_time=2)
        self.play(Write(T("4", 28).move_to(o + np.array([n * a / 2, -0.3, 0]))), Write(T("5", 28).move_to(o + np.array([-0.3, (n + 1) * a / 2, 0]))))
        self.play(Write(T("= 4 · 5 : 2 = 10", 32, ZUTA).move_to([1.8, 0.3, 0])))
        self.wait(3)


class ZbirUglova(Scene):
    """Tri ugla trougla složena jedan do drugog čine opružen ugao (180°)."""
    def construct(self):
        A, B, C = np.array([-3.2, -1.0, 0]), np.array([0.6, -1.0, 0]), np.array([-1.6, 1.6, 0])
        tr = Polygon(A, B, C).set_stroke(WHITE, 3)
        self.play(Create(tr))
        ug = lambda p, q: np.arctan2(q[1] - p[1], q[0] - p[0])
        def isecak(v, p, q, boja):
            u1, u2 = ug(v, p), ug(v, q)
            d = (u2 - u1) % TAU
            return Sector(radius=0.55, angle=d, start_angle=u1, arc_center=v).set_fill(boja, 0.85).set_stroke(boja, 1), d
        sa, da = isecak(A, B, C, ROZE)
        sb, db = isecak(B, C, A, ZELENA)
        sc, dc = isecak(C, A, B, ZUTA)
        self.play(FadeIn(sa), FadeIn(sb), FadeIn(sc))
        P = np.array([2.4, -0.4, 0])
        lin = Line(P + 2.0 * LEFT, P + 2.0 * RIGHT).set_stroke(WHITE, 3)
        self.play(Create(lin))
        cilj = [Sector(radius=0.9, angle=da, start_angle=0, arc_center=P).set_fill(ROZE, 0.85).set_stroke(ROZE, 1),
                Sector(radius=0.9, angle=dc, start_angle=da, arc_center=P).set_fill(ZUTA, 0.85).set_stroke(ZUTA, 1),
                Sector(radius=0.9, angle=db, start_angle=da + dc, arc_center=P).set_fill(ZELENA, 0.85).set_stroke(ZELENA, 1)]
        for s, c in zip([sa.copy(), sc.copy(), sb.copy()], cilj):
            self.play(Transform(s, c), run_time=1.2)
        self.play(Write(T("α + β + γ = 180°", 32, ZUTA).move_to([0.2, -1.8, 0])))
        self.wait(3)


class PovrsinaTrougla(Scene):
    """Dva ista trougla čine paralelogram: površina trougla je a · h : 2."""
    def construct(self):
        A, B, C = np.array([-3.3, -1.2, 0]), np.array([0.1, -1.2, 0]), np.array([-2.4, 1.2, 0])
        tr = Polygon(A, B, C).set_fill(ROZE, 0.6).set_stroke(WHITE, 2.5)
        self.play(FadeIn(tr))
        H = np.array([C[0], A[1], 0])
        self.play(Create(DashedLine(C, H).set_stroke(ZUTA, 2.5)), Write(T("h", 28, ZUTA).next_to(DashedLine(C, H), LEFT, 0.1)), Write(T("a", 28).move_to((A + B) / 2 + 0.3 * DOWN)))
        M = (B + C) / 2
        kopija = tr.copy().set_fill(PLAVA, 0.6)
        self.play(Rotate(kopija, PI, about_point=M), run_time=2)
        self.play(Write(T("a · h", 32).move_to([2.4, 0.5, 0])))
        self.play(Write(T("P = a · h : 2", 30, ZUTA).move_to([2.4, -0.3, 0])))
        self.wait(3)


class Paralelogram(Scene):
    """Odsečeni trougao se premesti na drugu stranu: paralelogram postaje pravougaonik a · h."""
    def construct(self):
        a, h, s = 3.0, 1.8, 1.2
        A = np.array([-2.8, -1.2, 0])
        B, C, D = A + a * RIGHT, A + (a + s) * RIGHT + h * UP, A + s * RIGHT + h * UP
        p = Polygon(A, B, C, D).set_fill(ZELENA, 0.5).set_stroke(WHITE, 2.5)
        self.play(FadeIn(p))
        E = A + s * RIGHT
        self.play(Create(DashedLine(D, E).set_stroke(ZUTA, 3)), Write(T("h", 28, ZUTA).move_to((D + E) / 2 + 0.25 * RIGHT)))
        trokut = Polygon(A, E, D).set_fill(ROZE, 0.7).set_stroke(WHITE, 2)
        self.play(FadeIn(trokut))
        self.play(trokut.animate.shift(a * RIGHT), run_time=2)
        self.play(Write(T("a", 28).move_to(E + (a / 2) * RIGHT + 0.3 * DOWN)))
        self.play(Write(T("P = a · h", 34, ZUTA).move_to([2.3, 1.4, 0])))
        self.wait(3)


class PeriferijskiUgao(Scene):
    """Gde god da je tačka C na luku, periferijski ugao je pola centralnog."""
    def construct(self):
        R = 1.8
        O = np.array([-1.2, 0, 0])
        K = lambda u: O + R * np.array([np.cos(u * DEGREES), np.sin(u * DEGREES), 0])
        A, B = K(230), K(310)
        self.add(Circle(R).move_to(O).set_stroke(GRAY, 2))
        self.play(Create(Line(O, A)), Create(Line(O, B)), Create(Angle(Line(O, A), Line(O, B), radius=0.45, color=ZUTA)))
        self.play(Write(T("80°", 26, ZUTA).move_to(O + 0.75 * DOWN)))
        t = ValueTracker(100)
        def slika():
            C = K(t.get_value())
            return VGroup(Line(C, A).set_stroke(PLAVA, 3), Line(C, B).set_stroke(PLAVA, 3), Dot(C, color=ROZE),
                          Angle(Line(C, A), Line(C, B), radius=0.5, color=ROZE, other_angle=False))
        g = always_redraw(slika)
        self.add(g)
        self.add(T("α = 40°", 36, ROZE).move_to([2.5, 0.6, 0]))
        self.play(t.animate.set_value(170), run_time=2)
        self.play(t.animate.set_value(20), run_time=3)
        self.play(t.animate.set_value(100), run_time=2)
        self.wait(2)


class Tales(Scene):
    """Ugao nad prečnikom je uvek prav."""
    def construct(self):
        R = 1.9
        O = np.array([-1.0, -0.4, 0])
        A, B = O + R * LEFT, O + R * RIGHT
        self.add(Circle(R).move_to(O).set_stroke(GRAY, 2))
        self.play(Create(Line(A, B).set_stroke(WHITE, 3)), Create(Dot(O)))
        t = ValueTracker(60)
        def slika():
            u = t.get_value() * DEGREES
            C = O + R * np.array([np.cos(u), np.sin(u), 0])
            l1, l2 = Line(C, A), Line(C, B)
            return VGroup(l1.set_stroke(PLAVA, 3), l2.set_stroke(PLAVA, 3), RightAngle(l1, l2, length=0.28, color=ZUTA, quadrant=(1, 1)), Dot(C, color=ROZE))
        self.add(always_redraw(slika))
        self.add(T("90°", 40, ZUTA).move_to([2.6, 0.8, 0]))
        self.play(t.animate.set_value(160), run_time=2.5)
        self.play(t.animate.set_value(15), run_time=3)
        self.play(t.animate.set_value(60), run_time=1.5)
        self.wait(2)


class PovrsinaKruga(Scene):
    """Isečci kruga preslagani u „paralelogram“ dužine πr i visine r."""
    def construct(self):
        n, R = 16, 1.3
        O = np.array([-1.9, 0.5, 0])
        u = TAU / n
        isecci = VGroup(*[Sector(radius=R, angle=u, start_angle=k * u, arc_center=O).set_fill(PLAVA if k % 2 else ROZE, 0.85).set_stroke(WHITE, 1) for k in range(n)])
        self.play(FadeIn(isecci))
        self.wait(0.5)
        # u red: isečci naizmenično vrhom nagore i nadole
        sir = 2 * R * np.sin(u / 2)  # tetiva
        x0 = -2.0
        y0 = -1.6
        cilj = VGroup()
        for k in range(n):
            if k % 2 == 0:
                vrh = np.array([x0 + k / 2 * sir + sir / 2, y0 + R * np.cos(u / 2), 0])
                s = Sector(radius=R, angle=u, start_angle=-PI / 2 - u / 2, arc_center=vrh)
            else:
                vrh = np.array([x0 + (k + 1) / 2 * sir, y0, 0])
                s = Sector(radius=R, angle=u, start_angle=PI / 2 - u / 2, arc_center=vrh)
            cilj.add(s.set_fill(PLAVA if k % 2 else ROZE, 0.85).set_stroke(WHITE, 1))
        self.play(Transform(isecci, cilj), run_time=2.5)
        sirina = n / 2 * sir
        self.play(Write(T("πr", 30, ZUTA).move_to([x0 + sirina / 2, y0 - 0.35, 0])), Write(T("r", 30, ZUTA).move_to([x0 - 0.35, y0 + R / 2, 0])))
        self.play(Write(T("P = πr · r = r²π", 30, ZUTA).move_to([1.5, 1.2, 0])))
        self.wait(3)


class Triangulacija(Scene):
    """Dijagonale iz jednog temena dele šestougao na 4 trougla: 4 · 180° = 720°."""
    def construct(self):
        R = 1.8
        O = np.array([-1.75, 0, 0])
        V = [O + R * np.array([np.cos(k * TAU / 6 + PI / 2), np.sin(k * TAU / 6 + PI / 2), 0]) for k in range(6)]
        self.play(Create(Polygon(*V).set_stroke(WHITE, 3)))
        boje = [PLAVA, ROZE, ZELENA, ZUTA]
        for k in range(1, 5):
            tr = Polygon(V[0], V[k], V[k + 1]).set_fill(boje[k - 1], 0.7).set_stroke(WHITE, 2)
            self.play(FadeIn(tr), Write(T("180°", 20, POZ).move_to((V[0] + V[k] + V[k + 1]) / 3)), run_time=0.8)
        self.play(Write(T("4 · 180° = 720°", 30, ZUTA).move_to([1.85, 0.4, 0])))
        self.play(Write(T("(6 − 2) · 180°", 26).move_to([1.85, -0.4, 0])))
        self.wait(3)


class KupaValjak(Scene):
    """Tri kupe vode napune valjak iste osnove i visine."""
    def construct(self):
        r, H = 0.9, 2.4
        y0 = -1.5
        cx = 1.4  # valjak
        kx = -2.0  # kupa
        valjak = VGroup(Line([cx - r, y0, 0], [cx - r, y0 + H, 0]), Line([cx + r, y0, 0], [cx + r, y0 + H, 0]),
                        Ellipse(2 * r, 0.4).move_to([cx, y0 + H, 0]), Arc(r, PI, PI).stretch(0.2 / r, 1).move_to([cx, y0 - 0.1, 0])).set_stroke(WHITE, 3)
        kupa = VGroup(Line([kx - r, y0 + H, 0], [kx, y0, 0]), Line([kx + r, y0 + H, 0], [kx, y0, 0]), Ellipse(2 * r, 0.4).move_to([kx, y0 + H, 0])).set_stroke(WHITE, 3)
        self.play(Create(valjak), Create(kupa))
        voda_v = Rectangle(width=2 * r, height=0.001).move_to([cx, y0, 0], aligned_edge=DOWN).set_fill(PLAVA, 0.7).set_stroke(width=0)
        self.add(voda_v)
        for k in range(1, 4):
            voda_k = Polygon([kx - r, y0 + H, 0], [kx + r, y0 + H, 0], [kx, y0, 0]).set_fill(PLAVA, 0.7).set_stroke(width=0)
            self.play(FadeIn(voda_k), run_time=0.5)
            nova = Rectangle(width=2 * r, height=H * k / 3).move_to([cx, y0, 0], aligned_edge=DOWN).set_fill(PLAVA, 0.7).set_stroke(width=0)
            self.play(FadeOut(voda_k, shift=0.3 * RIGHT), Transform(voda_v, nova), FadeIn(T(str(k), 34, ZUTA).move_to([cx + r + 0.4, y0 + H * k / 3 - 0.3, 0])), run_time=1.2)
        self.play(Write(T("V = 1/3 · r²πH", 32, ZUTA).move_to([-0.3, 1.75, 0])))
        self.wait(3)


class MrezaKocke(ThreeDScene):
    """Mreža kocke („krst“) se savija u kocku."""
    def construct(self):
        self.set_camera_orientation(phi=55 * DEGREES, theta=-60 * DEGREES, zoom=1.25)
        t = ValueTracker(0)
        def okret(p, osa, tacka, ugao):
            p = np.array(p, dtype=float) - tacka
            c, s = np.cos(ugao), np.sin(ugao)
            if osa == "x":
                p = np.array([p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c])
            else:
                p = np.array([p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c])
            return p + tacka
        def polje(i, j):
            return [np.array([i, j, 0.0]), np.array([i + 1, j, 0.0]), np.array([i + 1, j + 1, 0.0]), np.array([i, j + 1, 0.0])]
        pomak = np.array([-1.5, -2.5, 0])
        def strane():
            f = t.get_value() * PI / 2
            S = []
            S.append((polje(1, 2), PLAVA))  # osnova
            S.append(([okret(p, "x", np.array([0, 3, 0]), f) for p in polje(1, 3)], ROZE))
            S.append(([okret(p, "x", np.array([0, 2, 0]), -f) for p in polje(1, 1)], ZELENA))
            S.append(([okret(okret(p, "x", np.array([0, 1, 0]), -f), "x", np.array([0, 2, 0]), -f) for p in polje(1, 0)], ZUTA))
            S.append(([okret(p, "y", np.array([1, 0, 0]), f) for p in polje(0, 2)], LJUB))
            S.append(([okret(p, "y", np.array([2, 0, 0]), -f) for p in polje(2, 2)], NAR))
            return VGroup(*[Polygon(*[p + pomak for p in pts]).set_fill(c, 0.75).set_stroke(WHITE, 2) for pts, c in S])
        g = always_redraw(strane)
        self.add(g)
        self.wait(0.8)
        self.play(t.animate.set_value(1), run_time=3.5)
        self.begin_ambient_camera_rotation(rate=0.6)
        self.wait(3)
        self.stop_ambient_camera_rotation()
        self.wait(0.5)
