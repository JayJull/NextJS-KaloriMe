import { RegisterPresenter } from '@/presenters/RegisterPresenter';

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, email, password } = body;

    // Validasi basic request
    if (!name || !email || !password) {
      return Response.json(
        RegisterPresenter.formatApiResponse({
          success: false,
          message: 'Semua field harus diisi',
          errors: {
            name: !name ? 'Nama harus diisi' : null,
            email: !email ? 'Email harus diisi' : null,
            password: !password ? 'Password harus diisi' : null,
          }
        }),
        { status: 400 }
      );
    }

    // Process registration melalui presenter
    const result = await RegisterPresenter.handleRegister({
      name,
      email,
      password
    });

    // Return response based on result
    if (result.success) {
      return Response.json(
        RegisterPresenter.formatApiResponse(result),
        { status: 201 }
      );
    } else {
      return Response.json(
        RegisterPresenter.formatApiResponse(result),
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Register API Error:', error);
    
    return Response.json(
      RegisterPresenter.formatApiResponse({
        success: false,
        message: 'Internal server error',
        errors: {}
      }),
      { status: 500 }
    );
  }
}