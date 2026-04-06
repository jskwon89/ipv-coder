"use client";

import { useState } from "react";
import QuestionEditor, { type SurveyQuestion } from "@/components/QuestionEditor";
import SurveyPreview from "@/components/SurveyPreview";
import PageHeader from "@/components/PageHeader";

function generateSatisfactionTemplate(): SurveyQuestion[] {
  return [
    { id: crypto.randomUUID(), text: "전반적인 만족도를 평가해주세요.", type: "scale", required: true, scaleSize: 5, scaleLabels: { left: "매우 불만족", right: "매우 만족" } },
    { id: crypto.randomUUID(), text: "서비스 품질에 대해 얼마나 만족하십니까?", type: "scale", required: true, scaleSize: 5, scaleLabels: { left: "매우 불만족", right: "매우 만족" } },
    { id: crypto.randomUUID(), text: "다른 사람에게 추천할 의향이 있으십니까?", type: "scale", required: true, scaleSize: 5, scaleLabels: { left: "전혀 없다", right: "매우 그렇다" } },
    { id: crypto.randomUUID(), text: "가장 만족스러운 부분은 무엇입니까?", type: "radio", required: false, options: ["품질", "가격", "서비스", "접근성"], hasOtherOption: true },
    { id: crypto.randomUUID(), text: "개선이 필요한 사항을 자유롭게 작성해주세요.", type: "long", required: false },
  ];
}

function generatePerceptionTemplate(): SurveyQuestion[] {
  return [
    { id: crypto.randomUUID(), text: "해당 주제에 대해 얼마나 잘 알고 계십니까?", type: "scale", required: true, scaleSize: 5, scaleLabels: { left: "전혀 모른다", right: "매우 잘 안다" } },
    { id: crypto.randomUUID(), text: "이 주제가 중요하다고 생각하십니까?", type: "scale", required: true, scaleSize: 5, scaleLabels: { left: "전혀 그렇지 않다", right: "매우 그렇다" } },
    { id: crypto.randomUUID(), text: "관련 정보를 주로 어디서 얻으십니까?", type: "radio", required: true, options: ["뉴스/미디어", "SNS", "지인", "전문자료", "교육/강의"], hasOtherOption: true },
    { id: crypto.randomUUID(), text: "현재 정책/제도에 대한 인식은 어떠합니까?", type: "scale", required: true, scaleSize: 5, scaleLabels: { left: "매우 부정적", right: "매우 긍정적" } },
    { id: crypto.randomUUID(), text: "추가로 의견이 있으시면 작성해주세요.", type: "long", required: false },
  ];
}

function generatePrePostTemplate(): SurveyQuestion[] {
  return [
    { id: crypto.randomUUID(), text: "[사전] 해당 주제에 대한 이해도를 평가해주세요.", type: "scale", required: true, scaleSize: 5, scaleLabels: { left: "전혀 이해 못함", right: "완전히 이해" }, description: "--- 사전 검사" },
    { id: crypto.randomUUID(), text: "[사전] 해당 주제에 대한 관심도를 평가해주세요.", type: "scale", required: true, scaleSize: 5, scaleLabels: { left: "전혀 관심 없음", right: "매우 관심 있음" } },
    { id: crypto.randomUUID(), text: "[사전] 관련 경험이 있으십니까?", type: "radio", required: true, options: ["있다", "없다"] },
    { id: crypto.randomUUID(), text: "[사후] 해당 주제에 대한 이해도를 평가해주세요.", type: "scale", required: true, scaleSize: 5, scaleLabels: { left: "전혀 이해 못함", right: "완전히 이해" }, description: "--- 사후 검사" },
    { id: crypto.randomUUID(), text: "[사후] 해당 주제에 대한 관심도를 평가해주세요.", type: "scale", required: true, scaleSize: 5, scaleLabels: { left: "전혀 관심 없음", right: "매우 관심 있음" } },
    { id: crypto.randomUUID(), text: "[사후] 프로그램 참여 후 변화가 있었습니까?", type: "radio", required: true, options: ["매우 그렇다", "그렇다", "보통이다", "그렇지 않다", "전혀 그렇지 않다"] },
  ];
}

export default function SurveyRequestPage() {
  const [activeTab, setActiveTab] = useState<"request" | "builder">("request");
  const [formData, setFormData] = useState({
    title: "",
    purpose: "",
    requesterName: "",
    contact: "",
    organization: "",
    population: "",
    sampleSize: "",
    samplingMethod: "할당표집",
    selectionCriteria: "",
    questionCount: "",
    estimatedTime: "5~10분",
    questionText: "",
    scales: "",
    surveyMethods: [] as string[],
    startDate: "",
    endDate: "",
    irbStatus: "미신청",
    irbNumber: "",
    additionalRequests: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [exportCopied, setExportCopied] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Survey builder state
  const [surveyTitle, setSurveyTitle] = useState("");
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (value: string) => {
    setFormData((prev) => {
      const methods = prev.surveyMethods.includes(value)
        ? prev.surveyMethods.filter((m) => m !== value)
        : [...prev.surveyMethods, value];
      return { ...prev, surveyMethods: methods };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Survey request submitted:", formData);
    if (file) console.log("Attached file:", file.name);
    setSubmitted(true);
  };

  const handleSaveSurvey = () => {
    console.log("Survey saved:", { title: surveyTitle, questions });
    alert("설문지가 저장되었습니다.");
  };

  const handleSubmitAll = () => {
    console.log("Full submission:", { formData, survey: { title: surveyTitle, questions } });
    if (file) console.log("Attached file:", file.name);
    setSubmitted(true);
  };

  const handleExportSurvey = () => {
    const data = JSON.stringify({ title: surveyTitle, questions }, null, 2);
    navigator.clipboard.writeText(data).then(() => {
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 2000);
    });
  };

  const handleImportSurvey = () => {
    try {
      const data = JSON.parse(importJson);
      if (data.title !== undefined) setSurveyTitle(data.title);
      if (Array.isArray(data.questions)) {
        setQuestions(
          data.questions.map((q: SurveyQuestion) => ({
            ...q,
            id: crypto.randomUUID(),
          }))
        );
      }
      setShowImportDialog(false);
      setImportJson("");
    } catch {
      alert("올바른 JSON 형식이 아닙니다.");
    }
  };

  const applyTemplate = (template: "satisfaction" | "perception" | "prepost" | "empty") => {
    switch (template) {
      case "satisfaction":
        setQuestions(generateSatisfactionTemplate());
        setSurveyTitle("만족도 조사");
        break;
      case "perception":
        setQuestions(generatePerceptionTemplate());
        setSurveyTitle("인식 조사");
        break;
      case "prepost":
        setQuestions(generatePrePostTemplate());
        setSurveyTitle("사전-사후 검사");
        break;
      case "empty":
        setQuestions([]);
        setSurveyTitle("");
        break;
    }
  };

  if (submitted) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">의뢰가 접수되었습니다</h2>
          <p className="text-muted-foreground text-sm">검토 후 연락드리겠습니다.</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                title: "",
                purpose: "",
                requesterName: "",
                contact: "",
                organization: "",
                population: "",
                sampleSize: "",
                samplingMethod: "할당표집",
                selectionCriteria: "",
                questionCount: "",
                estimatedTime: "5~10분",
                questionText: "",
                scales: "",
                surveyMethods: [],
                startDate: "",
                endDate: "",
                irbStatus: "미신청",
                irbNumber: "",
                additionalRequests: "",
              });
              setFile(null);
              setSurveyTitle("");
              setQuestions([]);
            }}
            className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            새 의뢰 작성
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title="설문조사 의뢰"
        subtitle="설문조사에 필요한 정보를 입력해주세요. 검토 후 견적을 안내해드립니다."
        breadcrumbs={[
          { label: "설문조사" },
          { label: "설문조사 의뢰" },
        ]}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("request")}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "request"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          의뢰 정보
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("builder")}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "builder"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          설문지 작성
        </button>
      </div>

      {/* Tab 1: Request form */}
      {activeTab === "request" && (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          {/* Section 1 */}
          <section className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center">1</span>
              <h2 className="font-semibold">기본 정보</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">설문 제목 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">연구 목적 <span className="text-red-500">*</span></label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="본 설문의 목적을 간략히 기술해주세요"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">의뢰자 이름 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="requesterName"
                    value={formData.requesterName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">연락처 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    placeholder="이메일 또는 전화번호"
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">소속 기관</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="font-semibold">조사 대상</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">대상 모집단</label>
                <input
                  type="text"
                  name="population"
                  value={formData.population}
                  onChange={handleChange}
                  placeholder="예: 전국 만 19세 이상 성인 남녀"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">목표 표본 크기</label>
                  <input
                    type="number"
                    name="sampleSize"
                    value={formData.sampleSize}
                    onChange={handleChange}
                    placeholder="500"
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">표집 방법</label>
                  <select
                    name="samplingMethod"
                    value={formData.samplingMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option>할당표집</option>
                    <option>무작위표집</option>
                    <option>편의표집</option>
                    <option>눈덩이표집</option>
                    <option>기타</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">대상 선정 기준</label>
                <textarea
                  name="selectionCriteria"
                  value={formData.selectionCriteria}
                  onChange={handleChange}
                  rows={3}
                  placeholder="포함/제외 기준을 기술해주세요"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center">3</span>
              <h2 className="font-semibold">설문 문항</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">예상 문항 수</label>
                  <input
                    type="number"
                    name="questionCount"
                    value={formData.questionCount}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">예상 소요 시간</label>
                  <select
                    name="estimatedTime"
                    value={formData.estimatedTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option>5분 이내</option>
                    <option>5~10분</option>
                    <option>10~15분</option>
                    <option>15~20분</option>
                    <option>20분 이상</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">설문지 첨부</label>
                <input
                  type="file"
                  accept=".pdf,.docx,.hwp,.xlsx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, HWP, XLSX 파일 지원</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">또는 문항 직접 입력</label>
                <textarea
                  name="questionText"
                  value={formData.questionText}
                  onChange={handleChange}
                  rows={4}
                  placeholder="설문 문항을 직접 입력하거나 파일로 첨부해주세요"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">사용 척도</label>
                <input
                  type="text"
                  name="scales"
                  value={formData.scales}
                  onChange={handleChange}
                  placeholder="예: PHQ-9, GAD-7, 자체 개발 문항 등"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center">4</span>
              <h2 className="font-semibold">조사 방식</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">조사 방법</label>
                <div className="flex flex-wrap gap-3">
                  {["온라인 설문", "대면 면접", "전화 조사", "우편 조사"].map((method) => (
                    <label key={method} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.surveyMethods.includes(method)}
                        onChange={() => handleCheckbox(method)}
                        className="w-4 h-4 rounded border-border text-indigo-500 focus:ring-indigo-500/50"
                      />
                      <span className="text-sm">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">희망 조사 시작일</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">희망 조사 종료일</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">IRB 승인 여부</label>
                <div className="flex gap-4">
                  {["승인 완료", "진행 중", "미신청"].map((status) => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="irbStatus"
                        value={status}
                        checked={formData.irbStatus === status}
                        onChange={handleChange}
                        className="w-4 h-4 border-border text-indigo-500 focus:ring-indigo-500/50"
                      />
                      <span className="text-sm">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
              {formData.irbStatus === "승인 완료" && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">IRB 승인번호</label>
                  <input
                    type="text"
                    name="irbNumber"
                    value={formData.irbNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center">5</span>
              <h2 className="font-semibold">추가 요청사항</h2>
            </div>
            <div className="p-6">
              <textarea
                name="additionalRequests"
                value={formData.additionalRequests}
                onChange={handleChange}
                rows={4}
                placeholder="데이터 코딩, 기술통계 분석, 보고서 작성 등 추가 요청사항을 기재해주세요"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
            </div>
          </section>

          {/* Cost notice */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-indigo-700">예상 비용 안내</p>
                <p className="text-sm text-muted-foreground mt-1">
                  설문 규모와 방식에 따라 비용이 달라집니다. 의뢰 접수 후 1-2일 내 견적을 안내해드립니다.
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
            >
              의뢰 접수
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Survey Builder */}
      {activeTab === "builder" && (
        <div>
          {/* Template presets + import/export */}
          <div className="mb-6 bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">템플릿 프리셋</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportSurvey}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {exportCopied ? "복사 완료!" : "설문 내보내기"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowImportDialog(!showImportDialog)}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  설문 불러오기
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTemplate("satisfaction")}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
              >
                만족도 조사
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("perception")}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-colors"
              >
                인식 조사
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("prepost")}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-colors"
              >
                사전-사후 검사
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("empty")}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                빈 설문
              </button>
            </div>

            {/* Import dialog */}
            {showImportDialog && (
              <div className="mt-4 space-y-2">
                <textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder="내보내기한 JSON을 여기에 붙여넣으세요"
                  rows={4}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowImportDialog(false); setImportJson(""); }}
                    className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleImportSurvey}
                    disabled={!importJson.trim()}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50"
                  >
                    불러오기
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Question Editor (~60%) */}
            <div className="w-full lg:w-[60%]">
              <QuestionEditor questions={questions} onChange={setQuestions} />
            </div>

            {/* Right: Preview (~40%, sticky) */}
            <div className="w-full lg:w-[40%]">
              <div className="lg:sticky lg:top-8">
                <SurveyPreview
                  title={surveyTitle}
                  onTitleChange={setSurveyTitle}
                  questions={questions}
                />
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-border pt-6">
            <button
              type="button"
              onClick={handleSaveSurvey}
              className="px-6 py-3 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              설문지 저장
            </button>
            <button
              type="button"
              onClick={handleSubmitAll}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
            >
              의뢰 정보와 함께 제출
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
