# routes.rb
Rails.application.routes.draw do
  resources :users, only: [:create] do
    resources :activities, only: [:index] # Nest activities routes under users for listing activities
  end

  resources :banned_websites, only: [:index, :create, :destroy] # Update routes for banned websites

  post '/login', to: 'authentication#login'
  get '/user_info', to: 'authentication#user_info'
  get '/health', to: 'health#check'
  resources :activities, only: [] do
    post :track, on: :collection
  end
end
