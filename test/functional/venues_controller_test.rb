require File.dirname(__FILE__) + '/../test_helper'
require 'venues_controller'

# Re-raise errors caught by the controller.
class VenuesController; def rescue_action(e) raise e end; end

class VenuesControllerTest < ActionController::TestCase

  def test_should_get_index
    get :index
    assert_response :success
    assert assigns(:venues)
  end

  def test_should_get_new
    get :new
    assert_response :success
  end

  def test_should_create_venue
    old_count = Venue.count
    post :create, :venue => { }
    assert_equal old_count + 1, Venue.count

    assert_redirected_to venue_path(assigns(:venue))
  end

  def test_should_show_venue
    get :show, :id => 1
    assert_response :success
  end

  def test_should_get_edit
    get :edit, :id => 1
    assert_response :success
  end

  def test_should_update_venue
    put :update, :id => 1, :venue => { }
    assert_redirected_to venue_path(assigns(:venue))
  end

  def test_should_destroy_venue
    old_count = Venue.count
    delete :destroy, :id => 1
    assert_equal old_count-1, Venue.count

    assert_redirected_to venues_path
  end
end
