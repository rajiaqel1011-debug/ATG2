/* ═══════════════════════════════════════════════════════════════
   تدفئة الفيديو — علاج تقطّع «المرّة الأولى»
   الملاحظة الحاسمة من الاختبار الميداني: أول مرور بالسكرول على مقطعٍ
   يتقطّع، وإذا رجعتَ على نفس النقطة يصير حريرياً. أي أن **المرور مرّة
   واحدة يُدفّئ** المقطع (تصير بياناته وإطاراته حاضرة فوراً).
   إذاً الحل: نمرّ عليه نيابةً عن المستخدم قبل أن يصل — بتشغيله كاملاً
   بسرعة عالية وهو مخفي. التشغيل المتسلسل يفكّ كل الإطارات بترتيبها
   (أرخص بكثير من قفزات seek) فيصير أول مرور حقيقي للمستخدم دافئاً.

   ⚠️ لا تُدفّئ فيديو ظاهراً على الشاشة — سيراه المستخدم يركض. دفّئ
   المخفي (opacity 0 / خارج الشاشة) أو المغطّى باللودر.
   ═══════════════════════════════════════════════════════════════ */

/** active(): هل التدفئة جارية الآن؟ — على نظام السكرول أن يترك الفيديو
 *  وشأنه أثناءها، وإلا سحبَ الإطارَ رجوعاً لموضع السكرول فأجهض التدفئة. */
type WarmHandle = { cancel: () => void; active: () => boolean };

/** يشغّل الفيديو كاملاً بسرعة عالية ثم يعيده لبدايته — «مرور صامت» يُدفّئه.
 *  يُعيد true إن أكمل المرور فعلاً، false إن تعثّر (تبويب موقوف/منع تشغيل). */
function warmOne(v: HTMLVideoElement, rate: number): Promise<boolean> {
  return new Promise((resolve) => {
    let reachedEnd = false;
    let done = false;
    const wasLoop = v.loop;
    let lastT = -1;
    let stall = 0;
    let started = false; // صار التشغيل مطلوباً فعلاً (لا نحتسب تعثّراً قبله)

    const finish = () => {
      if (done) return;
      done = true;
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", finish);
      window.clearTimeout(safety);
      window.clearInterval(watch);
      try {
        v.pause();
        v.playbackRate = 1;
        v.loop = wasLoop;
        v.currentTime = 0;
      } catch {
        /* تجاهل */
      }
      resolve(reachedEnd);
    };

    const onTime = () => {
      // بعض المتصفحات لا تُطلق ended مع playbackRate عالٍ — نُنهي يدوياً
      if (v.duration && v.currentTime >= v.duration - 0.15) {
        reachedEnd = true;
        finish();
      }
    };

    const start = () => {
      if (done) return;
      v.loop = false; // وإلا لن ينتهي أبداً
      v.muted = true;
      v.playbackRate = rate;
      v.addEventListener("timeupdate", onTime);
      v.addEventListener("ended", () => {
        reachedEnd = true;
        finish();
      });
      started = true;
      v.play().catch(finish); // مُنع التشغيل؟ لا بأس — التنزيل وحده يفيد
    };

    // أمان مزدوج — التدفئة تحجب نظام السكرول مؤقتاً فيجب ألّا تتعثّر أبداً:
    // • سقف زمني ٦ ثوانٍ لكل فيديو.
    // • كاشف تعثّر: إن لم يتقدّم الزمن ١٫٤ث نتخلّى. المهلة سخيّة عمداً لأن
    //   عدة فيديوهات قد تتدفّأ بالتوازي فيتزاحم فكّ الترميز ويتأخّر البدء.
    const safety = window.setTimeout(finish, 6000);
    const watch = window.setInterval(() => {
      if (done || !started) return; // لا تحتسب تعثّراً قبل طلب التشغيل أصلاً
      if (v.currentTime === lastT) {
        if (++stall >= 7) finish();
      } else {
        stall = 0;
        lastT = v.currentTime;
      }
    }, 200);

    v.preload = "auto";
    if (v.readyState >= 2) start();
    else v.addEventListener("loadeddata", start, { once: true });
  });
}

/**
 * يُدفّئ قائمة فيديوهات بالتتابع (واحداً تلو الآخر كي لا يُرهق فك الترميز).
 * يعمل حتى النهاية ولا يُلغى بالسكرول — الإلغاء فقط عند تفكيك المكوّن.
 */
export function warmSequentially(
  videos: HTMLVideoElement[],
  onDone?: () => void,
  rate = 16
): WarmHandle {
  let cancelled = false;
  // warming = «الآن يمرّ فيديو فعلياً». الانتظار (ظهور التبويب) لا يُحتسب،
  // وإلا حجبنا نظام السكرول بلا داعٍ في تبويبٍ مخفيّ.
  let warming = false;

  let onVisible: (() => void) | null = null;

  /** يمرّ على القائمة ويُعيد ما تعثّر منها */
  const runPass = async (list: HTMLVideoElement[]) => {
    const failed: HTMLVideoElement[] = [];
    for (const v of list) {
      if (cancelled) break;
      warming = true;
      const ok = await warmOne(v, rate);
      warming = false;
      if (!ok) failed.push(v);
    }
    return failed;
  };

  (async () => {
    // نبدأ فوراً (التشغيل المكتوم يعمل غالباً حتى في تبويبٍ خلفي).
    let failed = await runPass(videos);
    // محاولة ثانية فورية: حين تتدفّأ عدة فيديوهات معاً قد يتزاحم فكّ الترميز
    // فيفشل بعضها بالتناوب؛ والمحاولة الثانية تمرّ عليها والساحة أهدأ.
    if (failed.length && !cancelled) {
      await new Promise((res) => window.setTimeout(res, 400));
      failed = await runPass(failed);
    }
    if (cancelled) return;
    onDone?.(); // سلّم القيادة لنظام السكرول ليضبط الإطار

    // ما تعثّر (تبويب موقوف مثلاً) نُعيد محاولته مرّة عند ظهور الصفحة
    if (failed.length && typeof document !== "undefined") {
      onVisible = async () => {
        if (cancelled || document.visibilityState !== "visible") return;
        document.removeEventListener("visibilitychange", onVisible!);
        onVisible = null;
        await runPass(failed);
        if (!cancelled) onDone?.();
      };
      document.addEventListener("visibilitychange", onVisible);
    }
  })();
  return {
    cancel: () => {
      cancelled = true;
      warming = false;
      if (onVisible) document.removeEventListener("visibilitychange", onVisible);
      videos.forEach((v) => {
        try {
          v.pause();
          v.playbackRate = 1;
        } catch {
          /* تجاهل */
        }
      });
    },
    active: () => warming && !cancelled,
  };
}

/**
 * يُدفّئ فيديوهاً **ظاهراً** بأمان: يغطّيه بصورته الثابتة (poster) أثناء المرور
 * السريع ثم يرفع الغطاء. المستخدم يرى الإطار نفسه ساكناً — لا يلحظ شيئاً.
 * يُستعمل حين لا يوجد لودر يغطّي المشهد (زيارة متكرّرة داخل الجلسة).
 */
export function warmBehindPoster(
  v: HTMLVideoElement,
  onDone?: () => void
): WarmHandle {
  const host = v.parentElement;
  const poster = v.getAttribute("poster");
  let cover: HTMLDivElement | null = null;

  if (host && poster) {
    cover = document.createElement("div");
    cover.style.cssText =
      "position:absolute;inset:0;z-index:5;background-size:cover;" +
      `background-position:center;background-image:url('${poster}')`;
    cover.setAttribute("aria-hidden", "true");
    host.appendChild(cover);
  }

  const drop = () => {
    cover?.remove();
    cover = null;
  };

  const h = warmSequentially([v], () => {
    drop();
    onDone?.();
  });

  return {
    cancel: () => {
      drop();
      h.cancel();
    },
    active: h.active,
  };
}

/** تنزيل فقط — بلا تشغيل (للفيديوهات الظاهرة التي لا يصحّ تدفئتها بصرياً) */
export function preloadOnly(v: HTMLVideoElement) {
  v.preload = "auto";
  try {
    v.load();
  } catch {
    /* تجاهل */
  }
}
