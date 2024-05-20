# banned_websites_controller.rb
class BannedWebsitesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_banned_website, only: [:destroy]

  # GET /banned_websites
  def index
    @banned_websites = current_user.banned_websites
    render json: @banned_websites
  end

  # POST /banned_websites
  def create
    @banned_website = current_user.banned_websites.new(banned_website_params)
    if @banned_website.save
      render json: @banned_website, status: :created
    else
      render json: @banned_website.errors, status: :unprocessable_entity
    end
  end

  # DELETE /banned_websites/:id
  def destroy
    if @banned_website.destroy
      render json: { message: 'Banned website successfully deleted.' }, status: :ok
    else
      render json: { error: 'Failed to delete banned website.' }, status: :unprocessable_entity
    end
  end

  private

  def set_banned_website
    @banned_website = current_user.banned_websites.find_by(id: params[:id])
    unless @banned_website
      render json: { error: 'Banned website not found' }, status: :not_found
    end
  end

  def banned_website_params
    params.require(:banned_website).permit(:url)
  end
end
