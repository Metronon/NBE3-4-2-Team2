"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowLeft } from "lucide-react";

export default function PostCreatePage() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleRequestClose = () => {
    setIsConfirmModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsConfirmModalOpen(false);
    router.push("/");
  };

  const handleCancelClose = () => {
    setIsConfirmModalOpen(false);
  };

  const handleGoBack = () => {
    if (selectedFiles && selectedFiles.length > 0) {
      setSelectedFiles(null);
      setImagePreviews([]);
    } else {
      handleRequestClose();
    }
  };

  const handleCreatePost = () => {
    console.log("게시물 생성!");
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 2200) {
      setPostContent(e.target.value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files.length <= 10) {
        setSelectedFiles(e.target.files);
        const previews: string[] = [];
        for (let i = 0; i < e.target.files.length; i++) {
          const file = e.target.files[i];
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) {
              previews.push(reader.result as string);
              if (previews.length === e.target.files?.length) {
                setImagePreviews(previews);
              }
            }
          };
          reader.readAsDataURL(file);
        }
      } else {
        alert("이미지는 최대 10개까지만 선택할 수 있습니다.");
      }
    }
  };

  useEffect(() => {
    if (imagePreviews.length === 0) {
      setCurrentIndex(0);
    }
  }, [imagePreviews]);

  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl relative w-[1000px] h-[800px] max-h-[80vh] overflow-y-auto">
            <button
              onClick={handleGoBack}
              className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 text-3xl"
            >
              <ArrowLeft size={40} />
            </button>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-center flex-grow">
                새 게시물 생성하기
              </h2>
              <button
                onClick={handleCreatePost}
                className="text-blue-500 font-bold hover:underline"
              >
                공유하기
              </button>
            </div>

            <hr className="border-t-2 border-gray-300 w-full mb-4" />

            {imagePreviews.length > 0 && (
              <div className="relative w-full h-[500px] bg-gray-200 border-2 border-gray-300 rounded-md">
                <img
                  src={imagePreviews[currentIndex]}
                  alt={`Preview ${currentIndex}`}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() =>
                    setCurrentIndex((prev) => Math.max(prev - 1, 0))
                  }
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full ${
                    currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={currentIndex === 0}
                >
                  &lt;
                </button>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      Math.min(prev + 1, imagePreviews.length - 1)
                    )
                  }
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full ${
                    currentIndex === imagePreviews.length - 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={currentIndex === imagePreviews.length - 1}
                >
                  &gt;
                </button>
              </div>
            )}

            {!selectedFiles && (
              <div
                className="w-full h-[500px] bg-gray-200 border-2 border-gray-300 rounded-md flex justify-center items-center cursor-pointer relative"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <p className="text-gray-500 text-4xl font-bold">+</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="fileInput"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}

            <div className="flex flex-col mb-4">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                style={{ height: "150px" }}
                placeholder="내용을 작성해주세요"
                value={postContent}
                onChange={handleContentChange}
              />
              <p className="text-right text-sm text-gray-500">
                {postContent.length} / 2200
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleRequestClose}
        className="absolute top-4 right-4 text-white hover:text-gray-700 text-3xl font-extrabold"
      >
        <X size={40} />
      </button>

      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-lg font-bold">정말로 나가시겠습니까?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                나가기
              </button>
              <button
                onClick={handleCancelClose}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
