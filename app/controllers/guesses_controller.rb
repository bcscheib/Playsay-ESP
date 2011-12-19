class GuessesController < ApplicationController
  layout 'default'

  def create
    render :json => {} if params[:guess][:body].blank?
    respond_to do |format|
      format.json do
         guess_to_return = @current_user.guesses.create(params[:guess])
         matched_guesses = @current_user.guesses.where(:matched => true, :photo_src => guess_to_return.photo_src)
         guess_to_return = matched_guesses.first unless matched_guesses.empty?
         render :json => guess_to_return
      end
    end
  end
end