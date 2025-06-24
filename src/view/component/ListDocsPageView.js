import React, { useEffect, useState, useRef, useCallback } from "react";
import { List, Typography, Spin, message, Button } from "antd";
import { request } from "../../config/request";
import { Config } from "../../config/helper";

const { Link } = Typography;

const ListDocsPageView = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [totalDocs, setTotalDocs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filterRef = useRef({ txt_search: "" });

  const getList = useCallback(async (page) => {
    setLoading(true);
    const param = {
      txt_search: filterRef.current.txt_search,
      page,
      pageSize,
    };
    try {
      const res = await request("documents/getList", "get", param);
      if (res && Array.isArray(res.list)) {
        const formatted = res.list.map((item) => ({
          title: item.title,
          link: Config.image_path + item.file_path,
        }));
        setDocuments(formatted);
        setTotalDocs(res.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
      message.error("បរាជ័យក្នុងការទាញយកឯកសារ");
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    getList(currentPage);
  }, [getList, currentPage]);

  const handleClick = (index, link) => {
    setClickedIndex(index);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const totalPages = Math.ceil(totalDocs / pageSize);

  return (
    <div style={{ padding: "16px" }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Siemreap&display=swap');
        `}
      </style>
      {loading ? (
        <Spin tip="កំពុងផ្ទុក..." />
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={documents}
            renderItem={(item, index) => (
              <List.Item>
                <Link
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onClick={() => handleClick(index, item.link)}
                  style={{
                    fontFamily: "'Khmer OS Siemreap', sans-serif",
                    cursor: "pointer",
                    color:
                      clickedIndex === index
                        ? "rgb(56 ,136 ,205)"
                        : "rgb(52, 50, 147)",
                    textDecoration:
                      hoverIndex === index || clickedIndex === index
                        ? "underline"
                        : "none",
                    transition: "text-decoration 0.3s, color 0.3s",
                    marginInline: "15px",
                    marginBottom: "-10px",
                    marginTop: "-2px",
                  }}
                >
                  {item.title}
                </Link>
              </List.Item>
            )}
          />

          {/* Manual Pagination Buttons */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24, gap: "16px" }}>
            <Button
              type="primary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span style={{ alignSelf: "center" }}>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              type="primary"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListDocsPageView;
