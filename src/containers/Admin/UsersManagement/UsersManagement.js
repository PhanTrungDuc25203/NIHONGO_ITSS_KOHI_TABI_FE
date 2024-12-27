import React, { useState, useMemo } from "react";
import { useTable, usePagination } from "react-table";
import "./UsersManagement.scss";

const UsersManagement = () => {
    // Dữ liệu mẫu
    const data = useMemo(
        () =>
            Array.from({ length: 50 }).map((_, index) => ({
                name: "Victoria Perez",
                userId: `LA-023${index}`,
                email: "abc@gmail.com",
                address: "Lorem Ipsum",
                phone: "0123456789",
            })),
        []
    );

    // Cấu hình cột
    const columns = useMemo(
        () => [
            { Header: "Name", accessor: "name" },
            { Header: "User ID", accessor: "userId" },
            { Header: "Email", accessor: "email" },
            { Header: "Address", accessor: "address" },
            { Header: "Phone number", accessor: "phone" },
            {
                Header: "Action",
                Cell: ({ row }) => (
                    <button
                        className="delete-button"
                        onClick={() => handleDelete(row.original.userId)}
                    >
                        🗑
                    </button>
                ),
            },
        ],
        []
    );

    // Các trạng thái tìm kiếm
    const [searchTerm, setSearchTerm] = useState("");
    const [searchColumn, setSearchColumn] = useState("name");

    // Hàm lọc dữ liệu
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;

        return data.filter((item) => {
            const value = item[searchColumn]?.toLowerCase() || "";
            return value.includes(searchTerm.toLowerCase());
        });
    }, [data, searchTerm, searchColumn]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data: filteredData,
            initialState: { pageIndex: 0, pageSize: 7 },
        },
        usePagination
    );

    // Xử lý xóa
    const handleDelete = (userId) => {
        alert(`Deleted user with ID: ${userId}`);
        // Thực hiện logic xóa tại đây
    };

    return (
        <div className="users-management-container">
            {/* <div className="header"> */}
                <h1 className="users-management-title">User Management</h1>
                <p className="users-management-title-info">User list</p>
            {/* </div> */}
            
            {/* Tìm kiếm */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    value={searchColumn}
                    onChange={(e) => setSearchColumn(e.target.value)}
                >
                    {columns.map((column) => (
                        <option key={column.accessor} value={column.accessor}>
                            {column.Header}
                        </option>
                    ))}
                </select>
            </div>
            
            <table {...getTableProps()} className="user-table">
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                <span>
                    Items per page:
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        {[7, 10, 15].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </span>
                <span>
                    Page {pageIndex + 1} of {pageOptions.length}
                </span>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {"<<"}
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {"<"}
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {">"}
                </button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {">>"}
                </button>
            </div>
        </div>
    );
};

export default UsersManagement;
