/*
|--------------------------------------------------------------------------
| LP プレビュー画面
|--------------------------------------------------------------------------
*/
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ViewHeader from "@/components/header/view";
import { Language, LocalizedHtml } from "@/types/website"; // 型をインポート

export default function View({ id }) {
  // 未ログインの場合はログインページへ
  const router = useRouter();
  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        router.push("/auth/login");
      }
    };
    checkLoginStatus();
  }, [router]);

  // デスクトップとモバイルの表示切り替え
  const [viewMode, setViewMode] = useState("desktop"); // 初期状態を'mobile'に設定

  // HTMLの取得
  const [htmlContent, setHtmlContent] = useState("");
  const [language, setLanguage] = useState<Language>(Language.JP); // Language 型を使用
  useEffect(() => {
    async function fetchHtml() {
      const url = `/api/website/${id}?lang=${language}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        // APIからのレスポンスをLocalizedHtml型として扱う
        const localizedHtml: LocalizedHtml[] = data.localizedHtml;
        // 選択された言語に対応するHTMLコンテンツを探す
        const htmlForLanguage =
          localizedHtml.find((html) => html.language === language)?.content ||
          "";
        setHtmlContent(htmlForLanguage);
      } else {
        console.error("Failed to fetch HTML content");
      }
    }
    fetchHtml();
  }, [id, language]);

  return (
    <div>
      {/* ヘッダー */}
      <ViewHeader>
        {/* 言語切り替えトグル */}
        <div className="ml-12">
          {Object.values(Language).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={
                language === lang
                  ? "border border-primary text-primary mr-2 px-4 py-1 rounded-full"
                  : "mr-2 px-4 py-1 rounded-full"
              }
            >
              {lang}
            </button>
          ))}{" "}
        </div>

        <div className="flex items-center ml-auto mr-16">
          {/* プレビュー切り替え */}
          <button
            id="desktop"
            className="hover:text-primary cursor-pointer"
            onClick={() => setViewMode("desktop")}
          >
            <Image
              src={
                viewMode === "desktop" ? "/desktop-primary.svg" : "/desktop.svg"
              }
              alt="desktop"
              width={30}
              height={30}
            />
          </button>
          <div className="border-r border-[#20303c] h-[25px] mx-8 opacity-50"></div>
          <button
            id="mobile"
            className="hover:text-primary cursor-pointer"
            onClick={() => setViewMode("mobile")}
          >
            <Image
              src={
                viewMode === "mobile" ? "/mobile-primary.svg" : "/mobile.svg"
              }
              alt="mobile"
              width={20}
              height={30}
            />
          </button>
        </div>

        <div className="mr-8">
          「編集」をクリックして、HTMLをダウンロードしましょう
        </div>

        <Link
          href={`/lp/edit/${id}`}
          passHref
          className="bg-primary text-white rounded-full px-6 py-2"
        >
          編集
        </Link>
      </ViewHeader>

      {/* メインコンテンツ */}
      <div className={`w-full min-h-screen mt-[89px] bg-[#F9FAFA]`}>
        {/* デスクトップ */}
        {viewMode === "desktop" && (
          <div className="desktop-prev">
            <div
              className={`desktop-prev__body ${
                htmlContent ? "bg-white" : "bg-[#C2C7CB]"
              }`}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            ></div>
          </div>
        )}
        {/* モバイル */}
        {viewMode === "mobile" && (
          <div className="p-8">
            <div className="mobile-prev mx-auto">
              <div
                className={`mobile-prev__body ${
                  htmlContent ? "bg-white" : "bg-[#C2C7CB]"
                }`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
