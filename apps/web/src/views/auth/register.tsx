"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "@/utils/axios";
import Swal from "sweetalert2";
import ErrorHandler from "@/utils/error-handler";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    const handleRegister = async (values: any) => {
        try {
            const { data } = await axiosInstance.post("/auth/register", values);
            Swal.fire({
              icon: "success",
              title: data.message,
              showConfirmButton: false,
              timer: 2000,
            }).then(() => router.push("/login"));
        } catch (err) {
            ErrorHandler(err);
        }
    }

    const formik = useFormik({
        initialValues: {
            fullname: '',
            email: '',
            phone_number: '',
            password: '',
            role: '',
            organizer_name: '',
            referral_code: '',

        },
        validationSchema: Yup.object({
            role: Yup.string()
                .required("Required"),
            organizer_name: Yup.string()
                .notRequired(),
            email: Yup.string()
                .email("Invalid email address")
                .required("Required"),
            phone_number: Yup.number()
                .min(8, "Invalid phone number")
                .required("Required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Required"),
            referral_code: Yup.string()
                .notRequired(),
        }),
        onSubmit: (values) => {
            handleRegister(values)
        },
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-600">
                        Role
                    </label>
                    <select
                        id="role"
                        onChange={(e) => {
                            const selectedValue = e.target.value;
                            if (selectedValue === "Admin") {
                              setIsAdmin(true)
                            }else{
                                setIsAdmin(false)
                            }
                            formik.setFieldValue("role", selectedValue); // Update Formik state
                        }}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" label="Pilih Tipe Akun" />
                        <option value="Admin" label="Event Organizer" />
                        <option value="User" label="Customer" />
                    </select>
                    {formik.touched.role && formik.errors.role ? (
                        <p className="text-sm text-red-600">{formik.errors.role}</p>
                    ) : null}
                </div>
                    {isAdmin && (
                        <div>
                        <label htmlFor="organizer_name" className="block text-sm font-medium text-gray-600">
                            Organizer Name
                        </label>
                        <input
                            type="text"
                            id="organizer_name"
                            {...formik.getFieldProps("organizer_name")}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.organizer_name && formik.errors.organizer_name ? (
                            <p className="text-sm text-red-600">{formik.errors.organizer_name}</p>
                        ) : null}
                        </div>
                    )}
                    <div>
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-600">
                            Fullname
                        </label>
                        <input
                            type="text"
                            id="fullname"
                            {...formik.getFieldProps('fullname')}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.fullname && formik.errors.fullname ? (
                            <p className="text-sm text-red-600">{formik.errors.fullname}</p>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...formik.getFieldProps('email')}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <p className="text-sm text-red-600">{formik.errors.email}</p>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-600">
                            Phone Number (start with 62)
                        </label>
                        <input
                            type="text"
                            accept="number"
                            id="phone_number"
                            {...formik.getFieldProps('phone_number')}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.phone_number && formik.errors.phone_number ? (
                            <p className="text-sm text-red-600">{formik.errors.phone_number}</p>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...formik.getFieldProps('password')}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <p className="text-sm text-red-600">{formik.errors.password}</p>
                        ) : null}
                    </div>
                    {!isAdmin && (
                        <div>
                        <label htmlFor="referral_code" className="block text-sm font-medium text-gray-600">
                            Refferal Code
                        </label>
                        <input
                            type="text"
                            id="referral_code"
                            {...formik.getFieldProps("referral_code")}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.referral_code && formik.errors.referral_code ? (
                            <p className="text-sm text-red-600">{formik.errors.referral_code}</p>
                        ) : null}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
