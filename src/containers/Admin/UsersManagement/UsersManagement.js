import React, { useState, useEffect, useMemo } from "react";
import { useTable, usePagination } from "react-table";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actions from "../../../store/actions";
import { FormattedMessage } from "react-intl";
import { toast } from 'react-toastify';
import { adminChangePasswordService } from "../../../services/userService";
import "./UsersManagement.scss";
import adminService from '../../../services/adminService';

const UsersManagement = (props) => {
    const { switchLanguageOfWebsite, processLogout, language } = props;

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

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchColumn, setSearchColumn] = useState("name");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await adminService.getAllUser();
                if (response && response.users) {
                    const formattedData = response.users.map((user) => ({
                        name: user.name,
                        userId: `ID-${user.id}`,
                        email: user.email,
                        address: user.address,
                        phone: user.phoneNumber,
                        role: user.role,
                    }));
                    setData(formattedData);
                }
            } catch (error) {
                toast.error("Failed to fetch user data!");
                console.error(error);
            }
        };
        fetchData();
    }, []);

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

    const handleDelete = (userId) => {
        toast.success(`Deleted user with ID: ${userId}`);
    };

    return (
        <div className="users-management-container">
            <h1 className="users-management-title">
                <FormattedMessage id="userManagement.title" defaultMessage="User Management" />
            </h1>
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

const mapStateToProps = (state) => ({
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
    switchLanguageOfWebsite: (language) => dispatch(actions.switchLanguageOfWebsite(language)),
    processLogout: () => dispatch(actions.processLogout()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UsersManagement));
