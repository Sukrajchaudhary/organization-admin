import { NextRequest, NextResponse } from "next/server";
import { LoginUser } from "@/apiServices/auth/api.authServices";
import { ApiError } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            statusCode: 400,
            message: "Validation failed",
            fields: [
              {
                field: "email",
                message: "Email is required",
                type: "field"
              },
              {
                field: "password",
                message: "Password is required",
                type: "field"
              }
            ]
          }
        },
        { status: 400 }
      );
    }

    const response = await LoginUser({ email, password });

    return NextResponse.json({
      success: true,
      user: {
        id: response.data._id,
        name: `${response.data.firstName} ${response.data.lastName}`,
        email: response.data.email,
        role: response.data.role,
      }
    });

  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            statusCode: error.statusCode || 400,
            message: error.message,
            fields: error.fields
          }
        },
        { status: error.statusCode || 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          statusCode: 500,
          message: "Internal server error"
        }
      },
      { status: 500 }
    );
  }
}