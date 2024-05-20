# app/controllers/authentication_controller.rb
class AuthenticationController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :login
  before_action :authenticate_request, except: [:login]
  # POST /login
  def login
    user = User.find_by(email: params[:email])
    if user && user.authenticate(params[:password])
      token = generate_token(user.id)
      render json: { token: token }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end
  def user_info
    user = current_user
    render json: user, status: :ok
  end
  private

  def generate_token(user_id)
    payload = { user_id: user_id }
    JWT.encode(payload, Rails.application.secret_key_base)
  end

  def authenticate_request
    header = request.headers['Authorization']
    token = header.split(' ').last if header.present?
    begin
      payload = JWT.decode(token, Rails.application.secret_key_base)[0]
      @current_user = User.find(payload['user_id'])
    rescue JWT::DecodeError
      render json: { error: 'Invalid token' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end
