# activities_controller.rb
class ActivitiesController < ApplicationController
  before_action :authenticate_request
  skip_before_action :verify_authenticity_token

  # POST /activities/track
  def track
    @activity = current_user.activities.new(activity_params)
    if @activity.save
      render json: @activity, status: :created
    else
      render json: { error: 'Failed to track activity' }, status: :unprocessable_entity
    end
  end

  # GET /users/:user_id/activities
  def index
    user = User.find(params[:user_id])
    if user == current_user
      activities = user.activities.order(created_at: :desc)
      render json: activities
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  private

  def activity_params
    params.require(:activity).permit(:website_url, :activity_type, :activity_time, :start_time, :time_elapsed)
  end
end
