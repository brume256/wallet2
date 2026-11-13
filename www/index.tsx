// deno-lint-ignore-file no-process-global

/// <reference lib="dom" />

/// <reference path="@/libs/files/lib.d.ts" />

import "@hazae41/symbol-dispose-polyfill";

import "@hazae41/disposable-stack-polyfill";

import "@hazae41/request-idle-callback-polyfill";

import { dirs, Lang } from "@/libs/lang/mod.ts";
import { StoreProvider } from "@/libs/store/mod.tsx";
import { App } from "@/mods/app/mod.tsx";
import { PathProvider, useHashPath } from "@hazae41/chemin";
import { immutable } from "@hazae41/immutable";
import { ClientProvider, useClient } from "@hazae41/react-client-context";
import { Rewind } from "@hazae41/rewind";
import React, { ReactNode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";

React;

async function register() {
  const { registration, update } = await immutable.serviceWorker.register("/service.worker.js", { scope: "/", updateViaCache: "all" })

  registration.addEventListener("updatefound", () => {
    const { installing, active } = registration

    if (active == null)
      return
    if (installing == null)
      return
    if (installing.scriptURL === active.scriptURL)
      return

    installing.addEventListener("statechange", async () => {
      if (installing.state !== "activated")
        return

      if (process.env.NODE_ENV !== "production")
        return

      location.reload()
    }, { passive: true })

    console.debug("A new service worker is being installed")
  }, { passive: true })

  if (update == null)
    return registration
  if (!confirm(Lang.match({ en: `An update of ${location.host} is available. Do you want to install it?`, zh: `有可用的 ${location.host} 更新。您想安装它吗？`, hi: `${location.host} का एक अपडेट उपलब्ध है। क्या आप इसे इंस्टॉल करना चाहते हैं?`, es: `Hay una actualización de ${location.host} disponible. ¿Quieres instalarla?`, ar: `يتوفر تحديث لـ ${location.host}. هل تريد تثبيته؟`, fr: `Une mise à jour de ${location.host} est disponible. Voulez-vous l'installer ?`, de: `Ein Update von ${location.host} ist verfügbar. Möchten Sie es installieren?`, ru: `Доступно обновление для ${location.host}. Вы хотите установить его?`, pt: `Uma atualização de ${location.host} está disponível. Você quer instalá-la?`, ja: `${location.host} のアップデートが利用可能です。インストールしますか？`, pa: `${location.host} ਦਾ ਇੱਕ ਅੱਪਡੇਟ ਉਪਲਬਧ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਸ ਨੂੰ ਇੰਸਟਾਲ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?`, bn: `${location.host} এর একটি আপডেট উপলব্ধ। আপনি কি এটি ইনস্টল করতে চান?`, id: `Pembaruan dari ${location.host} tersedia. Apakah Anda ingin menginstalnya?`, ur: `کے لیے ایک اپ ڈیٹ ${location.host} دستیاب ہے۔ کیا آپ اسے انسٹال کرنا چاہتے ہیں؟`, ms: `Kemas kini untuk ${location.host} tersedia. Adakah anda mahu memasangnya?`, it: `È disponibile un aggiornamento per ${location.host}. Vuoi installarlo?`, tr: `${location.host} için bir güncelleme mevcut. Kurmak ister misiniz?`, ta: `${location.host} க்கான ஒரு புதுப்பிப்பு கிடைக்கிறது. நீங்கள் அதை நிறுவ விரும்புகிறீர்களா?`, te: `${location.host} కోసం ఒక అప్‌డేట్ అందుబాటులో ఉంది. మీరు దాన్ని ఇన్‌స్టాల్ చేయాలనుకుంటున్నారా?`, ko: `${location.host}의 업데이트가 있습니다. 설치하시겠습니까?`, vi: `Có bản cập nhật của ${location.host} sẵn có. Bạn có muốn cài đặt nó không?`, pl: `Dostępna jest aktualizacja ${location.host}. Czy chcesz ją zainstalować?`, ro: `O actualizare pentru ${location.host} este disponibilă. Doriți să o instalați?`, nl: `Er is een update van ${location.host} beschikbaar. Wilt u het installeren?`, el: `Υπάρχει μια ενημέρωση για το ${location.host}. Θέλετε να την εγκαταστήσετε;`, th: `มีการอัปเดตของ ${location.host} คุณต้องการติดตั้งหรือไม่?`, cs: `Je k dispozici aktualizace ${location.host}. Chcete ji nainstalovat?`, hu: `Elérhető egy frissítés a ${location.host} számára. Szeretné telepíteni?`, sv: `En uppdatering av ${location.host} är tillgänglig. Vill du installera den?`, da: `En opdatering af ${location.host} er tilgængelig. Vil du installere den?` })))
    return registration

  return await update()
}

function Body() {
  const client = useClient()

  const path = useHashPath()

  useEffect(() => {
    const lang = Lang.get()

    document.documentElement.lang = lang
    document.documentElement.dir = dirs[lang]

    return
  }, [])

  useEffect(() => {
    register().catch(console.error)
  }, [])

  return <ClientProvider value={client}>
    <PathProvider value={path}>
      <StoreProvider>
        <div className="h-full w-full overflow-y-auto opacity-0 data-[client=true]:opacity-100 data-[client=true]:animate-opacity-in"
          data-client={client}>
          <App />
        </div>
      </StoreProvider>
    </PathProvider>
  </ClientProvider>
}

if (process.env.PLATFORM === "browser") {
  await new Rewind(document).hydrate().then(() => hydrateRoot(document.body, <Body />))
} else {
  const params = new URLSearchParams(location.search)

  const lang = params.get("lang") as Lang | null

  if (lang != null) {
    document.documentElement.lang = lang
    document.documentElement.dir = dirs[lang]
  }

  const prerender = async (node: ReactNode) => {
    const ReactDOM = await import("react-dom/static")

    using stack = new DisposableStack()

    const stream = await ReactDOM.default.prerender(node)
    const reader = stream.prelude.getReader()

    stack.defer(() => reader.releaseLock())

    let html = ""

    for (let result = await reader.read(); !result.done; result = await reader.read())
      html += new TextDecoder().decode(result.value)

    return html
  }

  document.body.innerHTML = await prerender(<Body />)

  await new Rewind(document).prerender()
}